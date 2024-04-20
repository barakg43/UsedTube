import concurrent.futures
import hashlib
import logging
import os
from concurrent.futures import ThreadPoolExecutor, wait
from typing import IO
from multipledispatch import dispatch
import cv2
import numpy as np
from more_itertools import consume

from engine.constants import SERIALIZE_LOGGER, DESERIALIZE_LOGGER, FILES_READY_FOR_RETRIEVAL_DIR
from engine.serialization.strategy.definition.serialization_strategy import SerializationStrategy
from engine.serialization.strategy.impl.bit_to_block import BitToBlock

serialize_logger = logging.getLogger(SERIALIZE_LOGGER)
deserialize_logger = logging.getLogger(DESERIALIZE_LOGGER)
"""
CHUNK_SIZE SHOULD BE CALCULATED ONCE, BASED ON ENCRYPTION METHOD WE WILL CHOOSE
IF ONLY ONE COVER VIDEO IS USED, METADATA SHOULD ALSO BE RETRIEVED ONCE
"""


class StatelessSerializer:
    strategy: SerializationStrategy = BitToBlock(2, "avc3", "mp4")
    concurrent_execution = True
    workers: ThreadPoolExecutor = ThreadPoolExecutor(50) if concurrent_execution else None
    ser_logger = logging.getLogger(SERIALIZE_LOGGER)
    deser_logger = logging.getLogger(DESERIALIZE_LOGGER)

    class Context:
        def __init__(self):
            self.fps = None
            self.encoding = None
            self.dims = None
            self.dims_multiplied = None
            self.file_size = None
            self.chunk_size = None
            self.fragments_count = None

        def get_fragments_count(self):
            return self.fragments_count

    @staticmethod
    def get_video_metadata(cover_video) -> Context:
        context = StatelessSerializer.Context()
        context.dims = (
            int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        )
        context.fps = cover_video.get(cv2.CAP_PROP_FPS)
        context.encoding = cv2.VideoWriter.fourcc(*StatelessSerializer.strategy.fourcc)
        context.dims_multiplied = np.multiply(*context.dims)

        return context

    @staticmethod
    def collect_metadata(file_to_serialize, cover_video) -> Context:
        context = StatelessSerializer.get_video_metadata(cover_video)
        context.file_size = os.path.getsize(file_to_serialize)
        context.chunk_size = StatelessSerializer.strategy.calculate_chunk_size(context.file_size)
        context.fragments_count = int(np.ceil(context.file_size / context.chunk_size))
        return context

    @staticmethod
    def serialize(file_to_serialize_path: str, cover_video_path: str, out_vid_path: str):
        """"
        :param out_vid_path: points to output save location
        :param cover_video_path: points to cover video
        :parameter file_to_serialize_path: points to file to serialize
        """
        file_to_serialize = open(file_to_serialize_path, 'rb')
        cover_video = cv2.VideoCapture(cover_video_path)
        context = StatelessSerializer.collect_metadata(file_to_serialize_path, cover_video)
        cover_video.release()

        StatelessSerializer.ser_logger.debug("context initialized.")

        num_of_fragments = context.get_fragments_count()
        serialized_frames = np.empty(num_of_fragments, dtype=object)
        futures = np.empty(num_of_fragments, dtype=concurrent.futures.Future)
        StatelessSerializer.ser_logger.debug(f"about to process {len(futures)} chunks")
        # read chunks sequentially and start strategy.serialize
        bytes_chunk = file_to_serialize.read(context.chunk_size)
        # StatelessSerializer.strategy.frames_amount = np.ceil(self.file_size / self.chunk_size)
        chunk_number = 0
        while bytes_chunk:
            # use serialize without ThreadPool
            if StatelessSerializer.workers:
                futures[chunk_number] = StatelessSerializer.workers.submit(StatelessSerializer.strategy.serialize,
                                                                           bytes_chunk, serialized_frames,
                                                                           chunk_number)
            else:
                futures[chunk_number] = StatelessSerializer.strategy.serialize(bytes_chunk, serialized_frames,
                                                                               chunk_number)
            # read next chunk
            chunk_number += 1
            StatelessSerializer.ser_logger.debug(f"serializor submitted chunk number #{chunk_number} for serialization")
            bytes_chunk = file_to_serialize.read(context.chunk_size)

        StatelessSerializer.ser_logger.debug(f"total of {chunk_number} chunks were submitted to workers")
        if StatelessSerializer.workers:
            wait(futures)
        StatelessSerializer.ser_logger.debug("waiting for workers to finish processing chunks...")

        output_video = cv2.VideoWriter(out_vid_path, context.encoding, context.fps, context.dims)

        file_to_serialize.close()

        consume(map(output_video.write, serialized_frames))
        # Closes all the video sources
        output_video.release()
        cv2.destroyAllWindows()

    @staticmethod
    def generateSha256ForFile(file_bytes: IO):
        file_bytes.seek(0)
        sha256Hashed = hashlib.file_digest(file_bytes, 'sha256').hexdigest()
        file_bytes.seek(0)
        return sha256Hashed

    @dispatch(str)
    @staticmethod
    def deserialize(serialized_file_as_video_path: str):
        deserialized_file_out_path = (FILES_READY_FOR_RETRIEVAL_DIR / f"des-{serialized_file_as_video_path}").as_posix()
        StatelessSerializer.deserialize(serialized_file_as_video_path,
                         os.path.getsize(serialized_file_as_video_path),
                         deserialized_file_out_path)
        return deserialized_file_out_path

    @dispatch(str, int, str)
    @staticmethod
    def deserialize(self, serialized_file_as_video_path: str, file_size: int, deserialized_file_out_path: str):

        serialized_file_videocap = cv2.VideoCapture(serialized_file_as_video_path)
        self.get_video_metadata(serialized_file_videocap)

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
            ret, serialized_frame = serialized_file_videocap.read()
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
        deserialized_out_file = open(deserialized_file_out_path, 'w')
        consume(map(lambda _bytes: deserialized_out_file.write(bytes(_bytes.tolist())), deserialized_bytes))
        deserialized_out_file.close()
        serialized_file_videocap.release()
        cv2.destroyAllWindows()

    @staticmethod
    def calculate_total_bytes(self, bytes_left_to_read):
        bytes_amount_to_read = self.chunk_size if bytes_left_to_read > self.strategy.dims_multiplied / self.strategy.bytes_2_pixels_ratio else bytes_left_to_read
        return bytes_amount_to_read
