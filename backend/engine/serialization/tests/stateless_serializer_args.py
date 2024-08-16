import concurrent.futures
import hashlib
import logging
import os
import uuid
from concurrent.futures import ThreadPoolExecutor, wait
from typing import IO
import cv2
import numpy as np
from more_itertools import consume
from engine.constants import SERIALIZE_LOGGER, DESERIALIZE_LOGGER, TMP_WORK_DIR
from engine.progress_tracker import Tracker
from engine.serialization.ffmpeg.video_capture import VideoCapture
from engine.serialization.ffmpeg.video_write import VideoWriter
from engine.serialization.strategy.definition.serialization_strategy import SerializationStrategy
from engine.serialization.strategy.impl.bit_to_block import BitToBlock

serialize_logger = logging.getLogger(SERIALIZE_LOGGER)
deserialize_logger = logging.getLogger(DESERIALIZE_LOGGER)
"""
CHUNK_SIZE SHOULD BE CALCULATED ONCE, BASED ON ENCRYPTION METHOD WE WILL CHOOSE
IF ONLY ONE COVER VIDEO IS USED, METADATA SHOULD ALSO BE RETRIEVED ONCE
"""


class StatelessSerializerArgs:
    ser_logger = logging.getLogger(SERIALIZE_LOGGER)
    deser_logger = logging.getLogger(DESERIALIZE_LOGGER)

    def __init__(self, fourcc: str = "mp4v", out_format: str = "mp4", block_size: int = 5,
                 concurrent_execution: bool = True):
        self.strategy: SerializationStrategy = BitToBlock(block_size, fourcc, out_format)
        self.workers: ThreadPoolExecutor = ThreadPoolExecutor(50) if concurrent_execution else None

    class Context:
        def __init__(self):
            self.fps = None
            self.encoding = None
            self.dims = None
            self.dims_multiplied = None
            self.file_size = None
            self.chunk_size = None
            self.frames_count = None

        def get_frames_count(self):
            return self.frames_count

    @property
    def fourcc(self):
        return self.strategy.fourcc

    def get_video_metadata(self, cover_video:VideoCapture) -> Context:
        context = StatelessSerializerArgs.Context()
        video_props=cover_video.get_video_props()
        context.dims = (
            video_props["width"],video_props["height"]
            # int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        )
        context.fps = video_props["fps"] #cover_video.get(cv2.CAP_PROP_FPS)
        context.encoding =video_props["codec"]    #cv2.VideoWriter.fourcc(*self.strategy.fourcc) #self.strategy.fourcc
        if context.dims[0] == 0 or context.dims[1] == 0:
            raise Exception(f"invalid video dimensions: {context.dims} on file {cover_video}")
        context.dims_multiplied = np.multiply(*context.dims)
        return context

    def initialize_serialization_context(self, file_to_serialize, cover_video) -> Context:
        context = self.get_video_metadata(cover_video)
        context.file_size = os.path.getsize(file_to_serialize)
        context.chunk_size = self.strategy.calculate_chunk_size(context.dims_multiplied)
        context.frames_count = int(np.ceil(context.file_size / context.chunk_size))
        return context

    def initialize_deserialization_context(self, file_size, serialized_file_as_video):
        context = self.get_video_metadata(serialized_file_as_video)
        context.file_size = file_size
        context.chunk_size = self.strategy.calculate_chunk_size(context.dims_multiplied)
        context.frames_count = int(np.ceil(context.file_size / context.chunk_size))
        return context

    def serialize(self, file_to_serialize_path: str, cover_video_path: str, out_vid_path: str, jobId: uuid):
        """"
        :param out_vid_path: points to output save location
        :param cover_video_path: points to cover video
        :parameter file_to_serialize_path: points to file to serialize
        """
        file_to_serialize = open(file_to_serialize_path, 'rb')
        cover_video = VideoCapture(cover_video_path)
        if cover_video.isOpened() is False:
            raise Exception(f"failed to open cover video: {cover_video_path}")
        context = self.initialize_serialization_context(file_to_serialize_path, cover_video)
        cover_video.release()

        StatelessSerializerArgs.ser_logger.debug("context initialized.")

        num_of_frames = context.get_frames_count()
        serialized_frames = np.empty(num_of_frames, dtype=object)
        futures = np.empty(num_of_frames, dtype=concurrent.futures.Future)
        StatelessSerializerArgs.ser_logger.debug(f"about to process {len(futures)} chunks")
        # read chunks sequentially and start strategy.serialize
        bytes_chunk = file_to_serialize.read(context.chunk_size)
        self.strategy.frames_amount = num_of_frames
        chunk_number = 0
        while bytes_chunk:
            # use serialize without ThreadPool
            if self.workers:
                futures[chunk_number] = self.workers.submit(self.strategy.serialize,
                                                            bytes_chunk, serialized_frames,
                                                            chunk_number, context)
            else:
                futures[chunk_number] = self.strategy.serialize(bytes_chunk, serialized_frames,
                                                                chunk_number, context)
            # read next chunk
            chunk_number += 1
            StatelessSerializerArgs.ser_logger.debug(
                f"serializer submitted chunk number #{chunk_number} ({len(bytes_chunk)} bytes) for serialization")
            bytes_chunk = file_to_serialize.read(context.chunk_size)

        StatelessSerializerArgs.ser_logger.debug(f"total of {chunk_number} chunks were submitted to workers")
        if self.workers:
            wait(futures)
            Tracker.set_progress(jobId, 0.75)
        StatelessSerializerArgs.ser_logger.debug("waiting for workers to finish processing chunks...")

        output_video = VideoWriter(out_vid_path, context.encoding, context.fps, context.dims)
        Tracker.set_progress(jobId, 0.85)
        file_to_serialize.close()

        consume(map(output_video.write, serialized_frames))
        # Closes all the video sources
        output_video.release()
        # cv2.destroyAllWindows()

    @staticmethod
    def generateSha256ForFile(file_bytes: IO):
        file_bytes.seek(0)
        sha256Hashed = hashlib.file_digest(file_bytes, 'sha256').hexdigest()
        file_bytes.seek(0)
        return sha256Hashed

    def deserialize(self, serialized_file_as_video_path: str, file_size: int, jobId: uuid):
        serialized_file_videocap = VideoCapture(serialized_file_as_video_path)
        context = self.initialize_deserialization_context(file_size, serialized_file_videocap)

        bytes_left_to_read = file_size
        StatelessSerializerArgs.deser_logger.debug("context initialized...")
        frames_count = context.get_frames_count()
        deserialized_bytes = np.empty(frames_count, dtype=object)
        futures = np.empty(frames_count, dtype=concurrent.futures.Future)

        StatelessSerializerArgs.deser_logger.debug(f"about to process {frames_count} frames")
        frame_number = 0
        self.strategy.frames_amount = frames_count

        frame_number = self.deserialize_frame_after_frame(bytes_left_to_read, context,
                                                          deserialized_bytes, frame_number, futures,
                                                          serialized_file_videocap)

        StatelessSerializerArgs.deser_logger.debug(f"total of {frame_number} frames were submitted to workers")

        if self.workers:
            wait(futures)
            Tracker.set_progress(jobId, 0.75)

        deserialized_out_path = (TMP_WORK_DIR / f"{uuid.uuid4()}").as_posix()
        deserialized_out_file = open(deserialized_out_path, 'wb')
        consume(map(lambda _bytes: deserialized_out_file.write(bytes(_bytes.tolist())), deserialized_bytes))
        deserialized_out_file.close()
        serialized_file_videocap.release()
        # cv2.destroyAllWindows()
        Tracker.set_progress(jobId, 0.85)
        return deserialized_out_path

    def deserialize_frame_after_frame(self, bytes_left_to_read, context, deserialized_bytes, frame_number, futures,
                                      serialized_file_videocap):
        while bytes_left_to_read > 0:
            ret, serialized_frame = serialized_file_videocap.read()
            if not ret:
                break

            bytes_amount_to_read = self.calculate_bytes_amount_to_read(bytes_left_to_read,
                                                                       context,
                                                                       self.strategy.bytes_2_pixels_ratio)
            bytes_left_to_read -= bytes_amount_to_read

            if self.workers:
                futures[frame_number] = self.workers.submit(self.strategy.deserialize,
                                                            bytes_amount_to_read,
                                                            serialized_frame,
                                                            deserialized_bytes, frame_number, context)
            else:
                futures[frame_number] = self.strategy.deserialize(bytes_amount_to_read, serialized_frame,
                                                                  deserialized_bytes, frame_number,
                                                                  context)
            frame_number += 1
            StatelessSerializerArgs.deser_logger.debug(
                f"serializer submitted chunk {bytes_amount_to_read} bytes #{frame_number} for deserialization")
        return frame_number

    @staticmethod
    def calculate_bytes_amount_to_read(bytes_left_to_read, context, bytes_2_pixels_ratio):
        bytes_amount_to_read = context.chunk_size if bytes_left_to_read > context.dims_multiplied / bytes_2_pixels_ratio \
            else bytes_left_to_read
        return bytes_amount_to_read
