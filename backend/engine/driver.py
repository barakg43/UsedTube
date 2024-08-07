import gzip
import os
import shutil
import uuid
from pathlib import Path
from typing import Tuple

from engine.constants import _4_MiB, COVER_VIDEOS_DIR, TMP_WORK_DIR, FILES_READY_FOR_RETRIEVAL_DIR
from engine.obfuscation.obfuscation_manager import ObfuscationManager
from engine.progress_tracker import Tracker
from engine.serialization.stateless_serializer import StatelessSerializer


class Driver:

    def __init__(self):
        self.__serializer = StatelessSerializer()
        self.__obfuscator = ObfuscationManager()

    def process_file_to_video(self, file_path: str, jobId: uuid, progress_tracker=None) -> Tuple[str, int]:
        # zip
        zipped_path = self.__gzip_it(file_path)
        Tracker.set_progress(jobId, 0.1)

        zipped_file_size = os.path.getsize(zipped_path)
        Tracker.set_progress(jobId, 0.15)
        # serialize
        cover_vid_path = self.__choose_cover_video(zipped_path)
        out_vid_path = f"{zipped_path}.mp4"
        self.__serializer.serialize(zipped_path, cover_vid_path, out_vid_path, jobId)
        os.remove(zipped_path)
        # obfuscate
        obfuscated_vid_path = self.__obfuscator.obfuscate(out_vid_path, cover_vid_path, self.__serializer.fourcc)
        Tracker.set_progress(jobId, 1)
        os.remove(out_vid_path)
        return obfuscated_vid_path, zipped_file_size

    def process_video_to_file(self, video_path: str, compressed_file_size: int, jobId: uuid) -> str:
        # untangle
        serialized_file_as_video_path = self.__obfuscator.untangle(video_path)
        Tracker.set_progress(jobId, 0.15)
        # deserialize
        zipped_file_path = self.__serializer.deserialize(serialized_file_as_video_path, compressed_file_size, jobId)
        # unzip
        os.remove(serialized_file_as_video_path)
        unzipped_file_path = self.__ungzip_it(zipped_file_path)
        Tracker.set_progress(jobId, 1)
        os.remove(zipped_file_path)
        return unzipped_file_path

    def __gzip_it(self, file_to_upload_path: str) -> str:
        gzipped_path = f"{file_to_upload_path}.gz"
        file_name_with_extension = Path(gzipped_path).name
        tmp_path = Path(TMP_WORK_DIR) / file_name_with_extension
        with open(file_to_upload_path, 'rb') as f_in, gzip.open(tmp_path, 'wb') as f_out:
            f_out.writelines(f_in)
        return tmp_path.as_posix()

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
