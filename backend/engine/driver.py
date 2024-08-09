import gzip
import os
import shutil
import uuid
from pathlib import Path
from typing import Tuple, Callable

from engine.constants import _4_MiB, COVER_VIDEOS_DIR, TMP_WORK_DIR, FILES_READY_FOR_RETRIEVAL_DIR
from engine.obfuscation.obfuscation_manager import ObfuscationManager
from engine.progress_tracker import Tracker
from engine.serialization.stateless_serializer import StatelessSerializer, serialize_logger


class Driver:

    def __init__(self):
        self.__serializer = StatelessSerializer()
        self.__logger = serialize_logger
        self.__obfuscator = ObfuscationManager()

    def process_file_to_video(self,
                              file_path: str, jobId: uuid,
                              progress_tracker: Callable[[int, int], None] = None) \
            -> Tuple[str, int]:
        #   zip
        update_serialization_progress=Driver.__build_phase_process_updater(1, progress_tracker)
        update_obfuscation_progress=Driver.__build_phase_process_updater(2, progress_tracker)

        self.__logger.info(f"zipping {file_path}")
        zipped_path = self.__gzip_it(file_path)
        Tracker.set_progress(jobId, 0.1)

        zipped_file_size = os.path.getsize(zipped_path)
        Tracker.set_progress(jobId, 0.15)
        # serialize

        cover_vid_path = self.__choose_cover_video(zipped_path)
        self.__logger.info(f"choosing cover {cover_vid_path}")
        out_vid_path = f"{zipped_path}.mp4"
        self.__logger.info(f"starting serializing to {out_vid_path}")
        self.__serializer.serialize(zipped_path, cover_vid_path, out_vid_path, jobId, update_serialization_progress)

        os.remove(zipped_path)
        # obfuscate
        self.__logger.info(f"starting obfuscating with cover video")
        obfuscated_vid_path = self.__obfuscator.obfuscate(out_vid_path, cover_vid_path, self.__serializer.fourcc,
                                                          update_obfuscation_progress)

        Tracker.set_progress(jobId, 1)
        os.remove(out_vid_path)
        self.__logger.info(f"finished processing file to video-result video path {obfuscated_vid_path}")
        return obfuscated_vid_path, zipped_file_size




    def process_video_to_file(self, video_path: str, compressed_file_size: int, jobId: uuid, progress_tracker: Callable[[int, int], None] = None) -> str:
        update_untangle_progress = Driver.__build_phase_process_updater(1, progress_tracker)
        update_deserialization_progress = Driver.__build_phase_process_updater(2, progress_tracker)
        def update_progress(progress):
            print(f"untangling progress:{progress * 100:.2f}%")
        # untangle
        self.__logger.info(f"{jobId}:untangling {video_path}")
        serialized_file_as_video_path = self.__obfuscator.untangle(video_path,update_progress)
        Tracker.set_progress(jobId, 0.15)
        # deserialize
        self.__logger.info(f"{jobId}:deserializing {serialized_file_as_video_path}")
        zipped_file_path = self.__serializer.deserialize(serialized_file_as_video_path, compressed_file_size, jobId,update_deserialization_progress)
        # unzip
        os.remove(serialized_file_as_video_path)
        self.__logger.info(f"{jobId}:unzipping {zipped_file_path}")
        unzipped_file_path = self.__ungzip_it(zipped_file_path)
        Tracker.set_progress(jobId, 1)
        os.remove(zipped_file_path)
        self.__logger.info(
            f"{jobId}:finished processing video to file-result file path {unzipped_file_path} with size {os.path.getsize(unzipped_file_path)}")
        return unzipped_file_path

    def __gzip_it(self, file_to_upload_path: str) -> str:
        gzipped_path = f"{file_to_upload_path}.gz"
        file_name_with_extension = Path(gzipped_path).name
        tmp_path = Path(TMP_WORK_DIR) / file_name_with_extension
        with open(file_to_upload_path, 'rb') as f_in, gzip.open(tmp_path, 'wb') as f_out:
            for chunk in iter(lambda: f_in.read(_4_MiB), b''):
                f_out.write(chunk)

        return tmp_path.as_posix()

    @staticmethod
    def __build_phase_process_updater(phase: int, progress_tracker: Callable[[int, int], None]):
        return lambda progress: progress_tracker(phase, progress)

    def __choose_cover_video(self, zipped_path: str) -> str:
        # file_size = BIG_FILE if os.path.getsize(zipped_path) > _4_MiB else SMALL_FILE
        # return (COVER_VIDEOS_DIR / f"{file_size}-files-cover.mp4").as_posix()
        return (COVER_VIDEOS_DIR / "cover-video.mp4").as_posix()

    def __ungzip_it(self, gzipped_file_path: str) -> str:
        unzipped_path = Path(
            FILES_READY_FOR_RETRIEVAL_DIR / Path(gzipped_file_path[:-3]).stem).as_posix()  # Remove the '.gz' extension
        with gzip.open(gzipped_file_path, 'rb') as f_in, open(unzipped_path, 'wb') as f_out:
            shutil.copyfileobj(f_in, f_out, _4_MiB)
        return unzipped_path
