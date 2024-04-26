import concurrent.futures
import hashlib
import logging
import os
from concurrent.futures import ThreadPoolExecutor, wait
from typing import IO
import vidgear.gears as vid
import cv2
import numpy as np
from more_itertools import consume

from server.engine.serialization.constants import SERIALIZE_LOGGER, DESERIALIZE_LOGGER
from server.engine.serialization.strategy.definition.serialization_strategy import SerializationStrategy

serialize_logger = logging.getLogger(SERIALIZE_LOGGER)
deserialize_logger = logging.getLogger(DESERIALIZE_LOGGER)
"""
CHUNK_SIZE SHOULD BE CALCULATED ONCE, BASED ON ENCRYPTION METHOD WE WILL CHOOSE
IF ONLY ONE COVER VIDEO IS USED, METADATA SHOULD ALSO BE RETRIEVED ONCE
"""


class Serializer:
    def __init__(self, strategy: SerializationStrategy, concurrent_execution=True):
        self.file_size: int = 0
        self.encoding: int = 0
        self.fps: int = 0
        self.chunk_size: int = 0
        self.strategy: SerializationStrategy = strategy
        if concurrent_execution:
            self.workers: ThreadPoolExecutor = ThreadPoolExecutor(25)  # Arbitrary; Inspired by FPS
        else:
            self.workers = None
        self.ser_logger = logging.getLogger(SERIALIZE_LOGGER)
        self.deser_logger = logging.getLogger(DESERIALIZE_LOGGER)
        self.original_sha256 = ""

    def get_cover_video_metadata(self, video_io: VideoCapture):
        width, height = video_io.get_video_props()["width"], video_io.get_video_props()["height"]

        self.strategy.dims = (width, height)
        self.fps = video_io.get_video_props()["fps"]
        self.encoding = video_io.get_video_props()["codec"]
        self.strategy.dims_multiplied = np.multiply(*self.strategy.dims)

    def collect_metadata(self, file_br, cover_video):
        self.get_cover_video_metadata(cover_video)
        fd = file_br.fileno()
        self.file_size = os.fstat(fd).st_size

    def __write_frames_concurrently_to_video(self, serialized_frames, output_video,
                                             futures: np.ndarray[concurrent.futures.Future]):
        frame_amount_in_block = 10

        # def process_frame(frame):
        #     self.__write_frame_to_video(frame, output_video)
        #     return None  # to remove the frame form memory

        for start_index in np.arange(0, len(serialized_frames), frame_amount_in_block):
            end_index = start_index + frame_amount_in_block
            wait(futures[start_index:end_index])
            consume(map(output_video.write, serialized_frames[start_index:end_index]))

    # def __write_frame_to_video(self, frame, output_video):
    #     output_video.stdin.write(frame.tobytes())

    def __write_bytes_concurrently_to_file(self, decrypted_bytes, decrypted_file,
                                           futures: np.ndarray[concurrent.futures.Future]):
        bytes_amount_in_block = 1000

        def process_byte(byte):
            decrypted_file.write(bytes(byte.tolist()))
            # return None  # to remove the byte form memory

        for start_index in np.arange(0, len(decrypted_bytes), bytes_amount_in_block):
            end_index = start_index + bytes_amount_in_block
            wait(futures[start_index:end_index])
            consume(map(process_byte, decrypted_bytes[start_index:end_index]))

    def serialize(self, file_to_serialize: IO, cover_video_path: str, out_vid_path: str):
        """"
        :param out_vid_path: string path
        :param cover_video_path:
        :parameter file_to_serialize an open file descriptor in 'rb' to the file
        """
        cover_video = VideoCapture(cover_video_path)
        self.collect_metadata(file_to_serialize, cover_video)

        if self.chunk_size == 0:
            self.ser_logger.debug("calculating chunk size")
            self.chunk_size = self.strategy.calculate_chunk_size()

        serialized_frames = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=object)
        futures = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=concurrent.futures.Future)
        self.ser_logger.debug(f"about to process {len(futures)} chunks")
        # read chunks sequentially and start strategy.serializ
        bytes_chunk = file_to_serialize.read(self.chunk_size)
        self.strategy.frames_amount = np.ceil(self.file_size / self.chunk_size)
        chunk_number = 0
        while bytes_chunk:
            # use serializ without ThreadPool
            if self.workers:
                futures[chunk_number] = self.workers.submit(self.strategy.serialize, bytes_chunk, serialized_frames,
                                                            chunk_number)
            else:
                futures[chunk_number] = self.strategy.serializ(bytes_chunk, serialized_frames,
                                                               chunk_number)
            # read next chunk
            chunk_number += 1
            self.ser_logger.debug(f"serializor submitted chunk number #{chunk_number} for serialization")
            bytes_chunk = file_to_serialize.read(self.chunk_size)

        self.ser_logger.debug(f"total of {chunk_number} chunks were submitted to workers")
        if self.workers:
            wait(futures)
        self.ser_logger.debug("waiting for workers to finish processing chunks...")
        #  "-vcodec":"libx264","-vtag":self.strategy.fourcc
        output_params_dic={"-output_dimensions": self.strategy.dims,} 
        output_video = vid.WriteGear(out_vid_path,compression_mode=True,**output_params_dic)
        consume(map(output_video.write, serialized_frames))

        # Closes all the video sources
        cover_video.release()
        output_video.close()
        cv2.destroyAllWindows()

    def generateSha256ForFile(self, file_bytes: IO):
        file_bytes.seek(0)
        sha256Hashed = hashlib.file_digest(file_bytes, 'sha256').hexdigest()
        file_bytes.seek(0)
        return sha256Hashed

    def deserialize(self, serialized_file_as_video_path, file_size, deserialized_file):

        enc_file_videocap = cv2.VideoCapture(serialized_file_as_video_path)
        self.get_cover_video_metadata(enc_file_videocap)

        bytes_left_to_read = file_size

        deserialized_bytes = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=object)
        futures = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=concurrent.futures.Future)
        if self.chunk_size is None:
            self.deser_logger.debug("calculating chunk size...")
            self.strategy.calculate_chunk_size()
        self.deser_logger.debug(f"about to process {len(futures)} frames")
        frame_number = 0
        self.strategy.frames_amount = np.ceil(file_size / self.chunk_size)

        while bytes_left_to_read > 0:
            ret, serialized_frame = enc_file_videocap.read()
            if not ret:
                break

            bytes_amount_to_read = self.calculate_total_bytes(bytes_left_to_read)
            bytes_left_to_read -= bytes_amount_to_read

            if self.workers:
                futures[frame_number] = self.workers.submit(self.strategy.deserialize, bytes_amount_to_read,
                                                            serialized_frame,
                                                            deserialized_bytes, frame_number)
            else:
                futures[frame_number] = self.strategy.deserialize(bytes_amount_to_read, serialized_frame,
                                                                  deserialized_bytes, frame_number)
            frame_number += 1
            self.deser_logger.debug(
                f"serializor submitted chunk {bytes_amount_to_read} bytes #{frame_number} for deserialization")

        self.ser_logger.debug(f"total of {frame_number} frames were submitted to workers")

        if self.workers:
            wait(futures)

        consume(map(lambda _bytes: deserialized_file.write(bytes(_bytes.tolist())), deserialized_bytes))

        enc_file_videocap.release()
        cv2.destroyAllWindows()

    def calculate_total_bytes(self, bytes_left_to_read):
        bytes_amount_to_read = self.chunk_size if bytes_left_to_read > self.strategy.dims_multiplied / self.strategy.bytes_2_pixels_ratio else bytes_left_to_read
        return bytes_amount_to_read
