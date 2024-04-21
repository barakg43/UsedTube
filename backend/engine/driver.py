import os.path
import zipfile

from engine.constants import BIG_FILE, _4_MiB, SMALL_FILE, COVER_VIDEOS_DIR, FILES_READY_FOR_STORAGE_DIR
from engine.serialization.stateless_serializer import StatelessSerializer
from serialization.serializer import Serializer
from obfuscation.obfuscation_manager import ObfuscationManager
import gzip
import os

class Driver:

    def __init__(self):
        self.__serializer = StatelessSerializer()
        self.__obfuscator = ObfuscationManager()

    def process_file_to_video(self, file_path: str) -> str:
        # zip
        zipped_path = self.__gzip_it(file_path)
        # serialize
        cover_vid_path = self.__choose_cover_video(zipped_path)
        out_vid_path = f"{zipped_path}.mp4"
        self.__serializer.serialize(zipped_path, cover_vid_path, out_vid_path)
        os.remove(zipped_path)
        # obfuscate
        out_vid_path = self.__obfuscator.obfuscate(out_vid_path, cover_vid_path, self.__serializer.fourcc)
        return out_vid_path

    def process_video_to_file(self, video_path: str, original_file_size: int) -> str:
        # untangle
        serialized_file_as_video_path = self.__obfuscator.untangle(video_path)
        # deserialize
        zipped_file_path = self.__serializer.deserialize(serialized_file_as_video_path, original_file_size)
        # unzip
        unzipped_file_path = self.__ungzip_it(zipped_file_path)
        return unzipped_file_path



    def __gzip_it(self, file_to_upload_path: str) -> str:
        gzipped_path = f"{file_to_upload_path}.gz"
        with open(file_to_upload_path, 'rb') as f_in, gzip.open(gzipped_path, 'wb') as f_out:
            f_out.writelines(f_in)
        return gzipped_path

    def __choose_cover_video(self, zipped_path: str) -> str:
        file_size = BIG_FILE if os.path.getsize(zipped_path) > _4_MiB else SMALL_FILE
        return (COVER_VIDEOS_DIR / f"{file_size}-files-cover.mp4").as_posix()

    def __ungzip_it(self, gzipped_file_path: str) -> str:
        unzipped_path = gzipped_file_path[:-3]  # Remove the '.gz' extension
        with gzip.open(gzipped_file_path, 'rb') as f_in, open(unzipped_path, 'wb') as f_out:
            f_out.write(f_in.read())
        return unzipped_path