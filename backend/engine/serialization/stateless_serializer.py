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
from engine.serialization.file_chuck_reader_iterator import FileChuckReaderIterator
from engine.serialization.strategy.definition.serialization_strategy import SerializationStrategy
from engine.serialization.strategy.impl.bit_to_block import BitToBlock

serialize_logger = logging.getLogger(SERIALIZE_LOGGER)
deserialize_logger = logging.getLogger(DESERIALIZE_LOGGER)
"""
CHUNK_SIZE SHOULD BE CALCULATED ONCE, BASED ON ENCRYPTION METHOD WE WILL CHOOSE
IF ONLY ONE COVER VIDEO IS USED, METADATA SHOULD ALSO BE RETRIEVED ONCE
"""


class StatelessSerializer:
    strategy: SerializationStrategy = BitToBlock(5, "mp4v", "mp4")
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
            self.frames_count = None

        def get_frames_count(self):
            return self.frames_count

    @property
    def fourcc(self):
        return StatelessSerializer.strategy.fourcc

    @staticmethod
    def get_video_metadata(cover_video) -> Context:
        context = StatelessSerializer.Context()
        context.dims = (
            int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        )
        context.fps = cover_video.get(cv2.CAP_PROP_FPS)
        context.encoding = cv2.VideoWriter.fourcc(*StatelessSerializer.strategy.fourcc)
        if context.dims[0] == 0 or context.dims[1] == 0:
            raise Exception(f"invalid video dimensions: {context.dims} on file {cover_video}")
        context.dims_multiplied = np.multiply(*context.dims)
        return context

    @staticmethod
    def initialize_serialization_context(file_to_serialize, cover_video) -> Context:
        context = StatelessSerializer.get_video_metadata(cover_video)
        context.file_size = os.path.getsize(file_to_serialize)
        context.chunk_size = StatelessSerializer.strategy.calculate_chunk_size(context.dims_multiplied)
        context.frames_count = int(np.ceil(context.file_size / context.chunk_size))
        return context

    @staticmethod
    def initialize_deserialization_context(file_size, serialized_file_as_video):
        context = StatelessSerializer.get_video_metadata(serialized_file_as_video)
        context.file_size = file_size
        context.chunk_size = StatelessSerializer.strategy.calculate_chunk_size(context.dims_multiplied)
        context.frames_count = int(np.ceil(context.file_size / context.chunk_size))
        return context

    @staticmethod
    def serialize(file_to_serialize_path: str, cover_video_path: str, out_vid_path: str, jobId: uuid,
                  progress_tracker: Callable[[float], None] = None):
        """"
        :param out_vid_path: points to output save location
        :param cover_video_path: points to cover video
        :parameter file_to_serialize_path: points to file to serialize
        """

        cover_video = cv2.VideoCapture(cover_video_path)
        if cover_video.isOpened() is False:
            raise Exception(f"failed to open cover video: {cover_video_path}")
        context = StatelessSerializer.initialize_serialization_context(file_to_serialize_path, cover_video)
        cover_video.release()

        StatelessSerializer.ser_logger.info(f"context initialized of {jobId}")

        num_of_frames = context.get_frames_count()
        serialized_frames = np.empty(num_of_frames, dtype=object)
        StatelessSerializer.ser_logger.debug(f"about to process {num_of_frames} chunks")
        # read chunks sequentially and start strategy.serialize

        StatelessSerializer.strategy.frames_amount = num_of_frames

        output_video, output_worker = StatelessSerializer.serialize_frame_after_frame(context,
                                                                                      file_to_serialize_path,
                                                                                      num_of_frames,
                                                                                      out_vid_path,
                                                                                      serialized_frames,
                                                                                      progress_tracker)
        StatelessSerializer.ser_logger.debug("waiting for workers to finish processing chunks...")
        output_worker.join()
        # Closes all the video sources
        StatelessSerializer.ser_logger.info(f"total of {num_of_frames} chunks were finish processed")
        output_video.release()
        cv2.destroyAllWindows()

    @staticmethod
    def serialize_frame_after_frame(context,
                                    file_to_serialize_path,
                                    num_of_frames,
                                    out_vid_path,
                                    serialized_frames,
                                    progress_tracker: Callable[[float], None] = None):
        bytes_generator = FileChuckReaderIterator(file_to_serialize_path, 'rb', context.chunk_size)
        serialize_processed_counter = AtomicCounter()
        write_processed_counter = AtomicCounter()
        futures = np.empty(num_of_frames, dtype=concurrent.futures.Future)

        def update_total_serialization_progress():
            processed_amount = serialize_processed_counter.value() / num_of_frames
            written_amount = write_processed_counter.value() / num_of_frames
            # print(f"processed {processed_amount*100:.2f}%, written {written_amount*100:.2f}%")
            total_progress = written_amount * 0.5 + processed_amount * 0.5
            progress_tracker(total_progress)

        # serialize frames queue to wait results
        future_queue = queue.Queue()
        output_video = cv2.VideoWriter(out_vid_path, context.encoding, context.fps, context.dims)
        output_worker = threading.Thread(target=StatelessSerializer.serialize_frame_done_writer_to_output_task,
                                         args=(future_queue,
                                               num_of_frames,
                                               output_video,
                                               update_total_serialization_progress,
                                               write_processed_counter))
        output_worker.start()
        for chunk_number, bytes_chunk in enumerate(bytes_generator):
            # serialize chunk
            # use serialize without ThreadPool
            if StatelessSerializer.workers:
                future = StatelessSerializer.workers.submit(StatelessSerializer.serialize_frame_task,
                                                            bytes_chunk,
                                                            chunk_number,
                                                            context,
                                                            serialize_processed_counter,
                                                            update_total_serialization_progress)

                future_queue.put(future)
            else:
                futures[chunk_number] = StatelessSerializer.strategy.serialize(bytes_chunk, serialized_frames,
                                                                               chunk_number, context)
            # read next chunk
            StatelessSerializer.ser_logger.debug(
                f"serializer submitted chunk number #{chunk_number} ({len(bytes_chunk)} bytes) for serialization")
        StatelessSerializer.ser_logger.debug(f"total of {serialize_processed_counter} chunks were submitted to workers")
        if StatelessSerializer.workers is None:
            consume(map(output_video.write, serialized_frames))
        return output_video, output_worker

    @staticmethod
    def serialize_frame_task(chuck_bytes: str | bytes | tuple[int, bytes],
                             chunk_number: int,
                             context: Context,
                             serialize_processed_counter: AtomicCounter,
                             update_total_serialization_progress: Callable[[], None]) -> np.ndarray:
        try:
            if len(chuck_bytes) == 0:
                raise BufferError("empty chunk")
            result_frame = StatelessSerializer.strategy.serialize_bytes_chunk(chuck_bytes, chunk_number, context)
            serialize_processed_counter.increment()
            update_total_serialization_progress()
            return result_frame
        except Exception as e:
            StatelessSerializer.ser_logger.error(f"failed to serialize chunk #{chunk_number}: {e}")
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
                StatelessSerializer.ser_logger.debug(
                    f"serializer write frame number #{frame_number} ({num_of_frames} bytes) to output")
                total_written_percentage = (frame_number / num_of_frames * 0.25) + 0.75
                write_processed_counter.increment()
                update_total_serialization_progress()
                # progress_tracker(total_written_percentage)
            except Exception as e:
                StatelessSerializer.ser_logger.error(
                    f"failed to serialize chunk #{frame_number}: {e}")
                raise e

    @staticmethod
    def generateSha256ForFile(file_bytes: IO):
        file_bytes.seek(0)
        sha256Hashed = hashlib.file_digest(file_bytes, 'sha256').hexdigest()
        file_bytes.seek(0)
        return sha256Hashed

    @staticmethod
    def deserialize(serialized_file_as_video_path: str, file_size: int, jobId: uuid,
                    progress_tracker: Callable[[float], None]):
        serialized_file_videocap = cv2.VideoCapture(serialized_file_as_video_path)
        context = StatelessSerializer.initialize_deserialization_context(file_size, serialized_file_videocap)

        bytes_left_to_read = file_size
        StatelessSerializer.deser_logger.debug("context initialized...")
        frames_count = context.get_frames_count()
        deserialized_bytes = np.empty(frames_count, dtype=object)
        futures = np.empty(frames_count, dtype=concurrent.futures.Future)

        StatelessSerializer.deser_logger.debug(f"about to process {frames_count} frames")
        frame_number = 0
        StatelessSerializer.strategy.frames_amount = frames_count

        frame_number = StatelessSerializer.deserialize_frame_after_frame(bytes_left_to_read, context,
                                                                         deserialized_bytes, frame_number, futures,
                                                                         serialized_file_videocap)

        StatelessSerializer.deser_logger.debug(f"total of {frame_number} frames were submitted to workers")

        if StatelessSerializer.workers:
            wait(futures)
            Tracker.set_progress(jobId, 0.75)

        deserialized_out_path = (TMP_WORK_DIR / f"{uuid.uuid4()}").as_posix()
        deserialized_out_file = open(deserialized_out_path, 'wb')
        consume(map(lambda _bytes: deserialized_out_file.write(bytes(_bytes.tolist())), deserialized_bytes))
        deserialized_out_file.close()
        serialized_file_videocap.release()
        cv2.destroyAllWindows()
        Tracker.set_progress(jobId, 0.85)
        return deserialized_out_path

    @staticmethod
    def deserialize_frame_after_frame(bytes_left_to_read, context, deserialized_bytes, frame_number, futures,
                                      serialized_file_videocap):
        while bytes_left_to_read > 0:
            ret, serialized_frame = serialized_file_videocap.read()
            if not ret:
                break

            bytes_amount_to_read = StatelessSerializer.calculate_bytes_amount_to_read(bytes_left_to_read,
                                                                                      context,
                                                                                      StatelessSerializer.strategy.bytes_2_pixels_ratio)
            bytes_left_to_read -= bytes_amount_to_read

            if StatelessSerializer.workers:
                futures[frame_number] = StatelessSerializer.workers.submit(StatelessSerializer.strategy.deserialize,
                                                                           bytes_amount_to_read,
                                                                           serialized_frame,
                                                                           deserialized_bytes, frame_number, context)
            else:
                futures[frame_number] = StatelessSerializer.strategy.deserialize(bytes_amount_to_read, serialized_frame,
                                                                                 deserialized_bytes, frame_number,
                                                                                 context)
            frame_number += 1
            StatelessSerializer.deser_logger.debug(
                f"serializer submitted chunk {bytes_amount_to_read} bytes #{frame_number} for deserialization")
        return frame_number

    @staticmethod
    def calculate_bytes_amount_to_read(bytes_left_to_read, context, bytes_2_pixels_ratio):
        bytes_amount_to_read = context.chunk_size if bytes_left_to_read > context.dims_multiplied / bytes_2_pixels_ratio \
            else bytes_left_to_read
        return bytes_amount_to_read
