import concurrent.futures
import hashlib
import logging
import os
import queue
import threading
import uuid
from concurrent.futures import ThreadPoolExecutor, wait
from typing import IO, Callable

import cv2
import numpy as np
from more_itertools import consume

from engine.constants import SERIALIZE_LOGGER, DESERIALIZE_LOGGER, TMP_WORK_DIR
from engine.progress_tracker import Tracker
from engine.serialization.atomic_counter import AtomicCounter
from engine.serialization.ffmpeg.video_capture import VideoCapture
from engine.serialization.file_chuck_reader_iterator import FileChuckReaderIterator
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

    def get_video_metadata(self, cover_video: VideoCapture) -> Context:
        context = StatelessSerializerArgs.Context()
        video_props = cover_video.get_video_props()
        context.dims = (
            video_props["width"], video_props["height"]
            # int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        )
        context.fps = video_props["fps"]  #cover_video.get(cv2.CAP_PROP_FPS)
        context.encoding = self.strategy.fourcc  #cv2.VideoWriter.fourcc(*self.strategy.fourcc) #self.strategy.fourcc
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

    def serialize(self, file_to_serialize_path: str, cover_video_path: str, out_vid_path: str, jobId: uuid,
                  progress_tracker: Callable[[float], None] = None, bitrate: int | None = None):
        """"
        :param out_vid_path: points to output save location
        :param cover_video_path: points to cover video
        :parameter file_to_serialize_path: points to file to serialize
        :param progress_tracker: accept a function that will be called on every progress update and get a float between 0 and 1
        :param bitrate: bitrate in kbps for improve video quality
        """

        cover_video = VideoCapture(cover_video_path)
        if cover_video.isOpened() is False:
            raise Exception(f"failed to open cover video: {cover_video_path}")
        context = self.initialize_serialization_context(file_to_serialize_path, cover_video)
        cover_video.release()

        StatelessSerializerArgs.ser_logger.info(f"context initialized of {jobId}")

        num_of_frames = context.get_frames_count()
        serialized_frames = np.empty(num_of_frames, dtype=object)
        StatelessSerializerArgs.ser_logger.debug(f"about to process {num_of_frames} chunks")
        # read chunks sequentially and start strategy.serialize

        # self.strategy.frames_amount = num_of_frames

        output_video, output_worker = self.serialize_frame_after_frame(context,
                                                                       file_to_serialize_path,
                                                                       num_of_frames,
                                                                       out_vid_path,
                                                                       serialized_frames,
                                                                       progress_tracker,
                                                                       bitrate)
        StatelessSerializerArgs.ser_logger.debug("waiting for workers to finish processing chunks...")
        output_worker.join()
        # Closes all the video sources
        StatelessSerializerArgs.ser_logger.info(f"total of {num_of_frames} chunks were finish processed")
        output_video.release()
        # cv2.destroyAllWindows()

    def serialize_frame_after_frame(self, context,
                                    file_to_serialize_path,
                                    num_of_frames,
                                    out_vid_path,
                                    serialized_frames,
                                    progress_tracker: Callable[[float], None] = None,
                                    bitrate: int | None = None):
        bytes_generator = FileChuckReaderIterator(file_to_serialize_path, 'rb', context.chunk_size)
        serialize_processed_counter = AtomicCounter()
        write_processed_counter = AtomicCounter()
        futures = np.empty(num_of_frames, dtype=concurrent.futures.Future)

        def update_total_serialization_progress():
            processed_amount = serialize_processed_counter.value() / num_of_frames
            written_amount = write_processed_counter.value() / num_of_frames
            # print(f"processed {processed_amount*100:.2f}%, written {written_amount*100:.2f}%")
            total_progress = written_amount * 0.5 + processed_amount * 0.5
            if progress_tracker:
                progress_tracker(total_progress)

        # serialize frames queue to wait results
        future_queue = queue.Queue()
        output_video = VideoWriter(out_vid_path, context.encoding, context.fps, context.dims, bitrate)
        output_worker = threading.Thread(target=self.serialize_frame_done_writer_to_output_task,
                                         args=(future_queue,
                                               num_of_frames,
                                               output_video,
                                               update_total_serialization_progress,
                                               write_processed_counter))
        output_worker.start()
        for chunk_number, bytes_chunk in enumerate(bytes_generator):
            # serialize chunk
            # use serialize without ThreadPool
            if self.workers:
                future = self.workers.submit(self.serialize_frame_task,
                                             bytes_chunk,
                                             chunk_number,
                                             context,
                                             serialize_processed_counter,
                                             update_total_serialization_progress)

                future_queue.put(future)
            else:
                futures[chunk_number] = self.serialize(bytes_chunk, serialized_frames,
                                                       chunk_number, context)
            # read next chunk
            StatelessSerializerArgs.ser_logger.debug(
                f"serializer submitted chunk number #{chunk_number} ({len(bytes_chunk)} bytes) for serialization")
        StatelessSerializerArgs.ser_logger.debug(
            f"total of {serialize_processed_counter} chunks were submitted to workers")
        if self.workers is None:
            consume(map(output_video.write, serialized_frames))
        return output_video, output_worker

    def serialize_frame_task(self,
                             chuck_bytes: str | bytes | tuple[int, bytes],
                             chunk_number: int,
                             context: Context,
                             serialize_processed_counter: AtomicCounter,
                             update_total_serialization_progress: Callable[[], None]) -> np.ndarray:
        try:
            if len(chuck_bytes) == 0:
                raise BufferError("empty chunk")
            result_frame = self.strategy.serialize_bytes_chunk(chuck_bytes, chunk_number, context)
            serialize_processed_counter.increment()
            update_total_serialization_progress()
            return result_frame
        except Exception as e:
            self.ser_logger.error(f"failed to serialize chunk #{chunk_number}: {e}")
            raise e

    def deserialize_frame_task(self,
                               bytes_amount: int,
                               encrypted_frame: np.ndarray,
                               index: int,
                               context: Context,
                               deserialize_processed_counter: AtomicCounter,
                               update_total_deserialization_progress: Callable[[], None]) -> np.ndarray:
        try:
            if bytes_amount == 0:
                raise BufferError("empty chunk")
            restored_bytes = self.strategy.deserialize_frame(bytes_amount, encrypted_frame, index,
                                                             context)
            deserialize_processed_counter.increment()
            update_total_deserialization_progress()
            return restored_bytes
        except Exception as e:
            StatelessSerializerArgs.ser_logger.error(f"failed to serialize chunk #{index}: {e}")
            raise e

    @staticmethod
    def serialize_frame_done_writer_to_output_task(future_queue,
                                                   num_of_frames,
                                                   output_video,
                                                   update_total_serialization_progress,
                                                   write_processed_counter: AtomicCounter
                                                   ):

        for frame_number in range(1, num_of_frames + 1):
            try:
                future = future_queue.get()
                frame = future.result()
                output_video.write(frame)
                StatelessSerializerArgs.ser_logger.debug(
                    f"serializer write frame number #{frame_number} ({num_of_frames} frames) to output")
                total_written_percentage = (frame_number / num_of_frames * 0.25) + 0.75
                write_processed_counter.increment()
                update_total_serialization_progress()
                # progress_tracker(total_written_percentage)
            except Exception as e:
                StatelessSerializerArgs.ser_logger.error(
                    f"failed to serialize chunk #{frame_number}: {e}")
                raise e

    def deserialize_frame_done_writer_to_output_task(self, future_queue,
                                                     num_of_bytes_chunk,
                                                     update_total_serialization_progress,
                                                     write_processed_counter: AtomicCounter,
                                                     deserialized_out_path: str):

        deserialized_out_file = open(deserialized_out_path, 'wb')
        for bytes_number in range(1, num_of_bytes_chunk + 1):
            try:
                future = future_queue.get()
                bytes_array = future.result()
                deserialized_out_file.write(bytes(bytes_array.tolist()))
                StatelessSerializerArgs.ser_logger.debug(
                    f"deserializer write bytes number #{bytes_number} to output")
                write_processed_counter.increment()
                update_total_serialization_progress()
                # progress_tracker(total_written_percentage)
            except Exception as e:
                StatelessSerializerArgs.ser_logger.error(
                    f"failed to write bytes chunk #{bytes_number}: {e}")
                raise e
        deserialized_out_file.close()

    @staticmethod
    def generateSha256ForFile(file_bytes: IO):
        file_bytes.seek(0)
        sha256Hashed = hashlib.file_digest(file_bytes, 'sha256').hexdigest()
        file_bytes.seek(0)
        return sha256Hashed

    def deserialize(self, serialized_file_as_video_path: str, file_size: int, jobId: uuid,
                    progress_tracker: Callable[[float], None]):
        serialized_file_videocap = VideoCapture(serialized_file_as_video_path)
        context = self.initialize_deserialization_context(file_size, serialized_file_videocap)
        deserialize_processed_counter = AtomicCounter()
        write_processed_counter = AtomicCounter()
        bytes_left_to_read = file_size
        StatelessSerializerArgs.deser_logger.debug("context initialized...")
        frames_count = context.get_frames_count()
        deserialized_bytes = np.empty(frames_count, dtype=object)
        futures = np.empty(frames_count, dtype=concurrent.futures.Future)

        StatelessSerializerArgs.deser_logger.debug(f"about to process {frames_count} frames")
        frame_number = 0

        def update_total_deserialization_progress():
            processed_amount = deserialize_processed_counter.value() / frames_count
            written_amount = write_processed_counter.value() / frames_count
            # print(f"processed {processed_amount*100:.2f}%, written {written_amount*100:.2f}%")
            total_progress = written_amount * 0.5 + processed_amount * 0.5
            progress_tracker(total_progress)

        # self.strategy.frames_amount = frames_count
        future_queue = queue.Queue()
        deserialized_out_path = (TMP_WORK_DIR / f"{uuid.uuid4()}").as_posix()
        output_worker = threading.Thread(target=self.deserialize_frame_done_writer_to_output_task,
                                         args=(future_queue,
                                               frames_count,
                                               update_total_deserialization_progress,
                                               write_processed_counter,
                                               deserialized_out_path))
        output_worker.start()
        frame_number = self.deserialize_frame_after_frame(bytes_left_to_read,
                                                          context,
                                                          deserialized_bytes,
                                                          future_queue,
                                                          serialized_file_videocap,
                                                          deserialize_processed_counter,
                                                          update_total_deserialization_progress)

        self.deser_logger.debug(f"total of {frame_number} frames were submitted to workers")
        output_worker.join()
        serialized_file_videocap.release()
        # cv2.destroyAllWindows()
        return deserialized_out_path

    def deserialize_frame_after_frame(self, bytes_left_to_read,
                                      context,
                                      deserialized_bytes,
                                      future_queue,
                                      serialized_file_videocap,
                                      deserialize_processed_counter: AtomicCounter,
                                      update_total_deserialization_progress: Callable[[], None]):

        frame_number = 1
        while bytes_left_to_read > 0:
            ret, serialized_frame = serialized_file_videocap.read()
            if not ret:
                break

            bytes_amount_to_read = self.calculate_bytes_amount_to_read(bytes_left_to_read,
                                                                       context,
                                                                       self.strategy.bytes_2_pixels_ratio)
            bytes_left_to_read -= bytes_amount_to_read

            if self.workers:
                future = self.workers.submit(self.deserialize_frame_task,
                                             bytes_amount_to_read,
                                             serialized_frame,
                                             frame_number,
                                             context,
                                             deserialize_processed_counter,
                                             update_total_deserialization_progress)
                future_queue.put(future)
            else:
                self.strategy.deserialize(bytes_amount_to_read, serialized_frame,
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
