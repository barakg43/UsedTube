import glob
import gzip
import os
import random
import shutil
import uuid
from pathlib import Path
from typing import Tuple, Callable

from engine.constants import _4_MiB, COVER_VIDEOS_DIR, TMP_WORK_DIR, FILES_READY_FOR_RETRIEVAL_DIR
from engine.obfuscation.obfuscation_manager import ObfuscationManager
from engine.serialization.file_chuck_reader_iterator import FileChuckReaderIterator
from engine.serialization.serializer import serialize_logger
from engine.serialization.tests.stateless_serializer_args import StatelessSerializerArgs


class DriverArgs:

    def __init__(self, fourcc: str = "mp4v", out_format: str = "mp4", block_size: int = 5,
                 concurrent_execution: bool = True):
        self.__serializer = StatelessSerializerArgs(fourcc, out_format, block_size, concurrent_execution)
        self.block_size = block_size
        self.__obfuscator = ObfuscationManager(intermeshing_cycle=20)
        self.__logger = serialize_logger

    def process_file_to_video(self,
                              file_path: str, job_id: uuid,
                              progress_tracker: Callable[[int, float], None] = None,
                              bitrate: int | None = None) \
            -> Tuple[str, int]:
        #   zip
        update_serialization_progress = DriverArgs.__build_phase_process_updater(1, progress_tracker)
        update_obfuscation_progress = DriverArgs.__build_phase_process_updater(2, progress_tracker)

        self.__logger.info(f"zipping {file_path}")
        zipped_path = self.__gzip_it(file_path)

        zipped_file_size = os.path.getsize(zipped_path)
        # serialize

        cover_vid_path = self.__choose_cover_video(zipped_path)
        self.__logger.info(f"choosing cover {cover_vid_path}")
        out_vid_path = f"{zipped_path}.mp4"
        self.__logger.info(f"starting serializing to {out_vid_path}")
        self.__serializer.serialize(zipped_path, cover_vid_path, out_vid_path, job_id, update_serialization_progress,
                                    bitrate)

        os.remove(zipped_path)
        # obfuscate
        self.__logger.info(f"starting obfuscating with cover video")
        obfuscated_vid_path = self.__obfuscator.obfuscate(out_vid_path, cover_vid_path, self.__serializer.fourcc,
                                                          update_obfuscation_progress, bitrate, self.block_size)

        os.remove(out_vid_path)
        self.__logger.info(f"finished processing file to video-result video path {obfuscated_vid_path}")
        return obfuscated_vid_path, zipped_file_size

    def process_video_to_file(self, video_path: str, compressed_file_size: int, jobId: uuid,
                              progress_tracker: Callable[[float, int], None] = None) -> str:
        update_untangle_progress = DriverArgs.__build_phase_process_updater(1, progress_tracker)
        update_deserialization_progress = DriverArgs.__build_phase_process_updater(2, progress_tracker)

        # untangle
        self.__logger.info(f"{jobId}:untangling {video_path}")
        serialized_file_as_video_path = self.__obfuscator.untangle(video_path, self.__serializer.fourcc,
                                                                   update_untangle_progress)
        # deserialize
        self.__logger.info(f"{jobId}:deserializing {serialized_file_as_video_path}")
        zipped_file_path = self.__serializer.deserialize(serialized_file_as_video_path,
                                                         compressed_file_size, jobId,
                                                         update_deserialization_progress)
        # unzip
        os.remove(serialized_file_as_video_path)
        self.__logger.info(f"{jobId}:unzipping {zipped_file_path}")
        unzipped_file_path = self.__ungzip_it(zipped_file_path)
        os.remove(zipped_file_path)
        self.__logger.info(
            f"{jobId}:finished processing video to file-result file path {unzipped_file_path} with size {os.path.getsize(unzipped_file_path)}")
        return unzipped_file_path

    def __gzip_it(self, file_to_upload_path: str) -> str:
        gzipped_path = f"{file_to_upload_path}_{uuid.uuid1()}.gz"
        file_name_with_extension = Path(gzipped_path).name
        tmp_path = Path(TMP_WORK_DIR) / file_name_with_extension
        f_in = FileChuckReaderIterator(file_to_upload_path, 'rb', _4_MiB)
        with gzip.open(tmp_path, 'wb') as f_out:
            for chunk in f_in:
                f_out.write(chunk)

        return tmp_path.as_posix()

    @staticmethod
    def __build_phase_process_updater(phase: int, progress_tracker: Callable[[int, float], None] | None):
        if progress_tracker is not None:
            return lambda progress: progress_tracker(phase, progress)
        else:
            return lambda progress: progress

    def __choose_cover_video(self, zipped_path: str) -> str:
        video_file_list = glob.glob((COVER_VIDEOS_DIR / "cover-video*.mp4").as_posix())
        chosen_file = random.choice(video_file_list)
        # file_size = BIG_FILE if os.path.getsize(zipped_path) > _4_MiB else SMALL_FILE
        # return (COVER_VIDEOS_DIR / f"{file_size}-files-cover.mp4").as_posix()
        return chosen_file

    def __ungzip_it(self, gzipped_file_path: str) -> str:
        unzipped_path = Path(
            FILES_READY_FOR_RETRIEVAL_DIR / Path(gzipped_file_path[:-3]).stem).as_posix()  # Remove the '.gz' extension
        with gzip.open(gzipped_file_path, 'rb') as f_in, open(unzipped_path, 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out, _4_MiB)
            f_out.close()
            f_in.close()
        return unzipped_path
