import os.path
from os.path import basename
import zipfile
from serialization.serializer import Serializer
from obfuscation.obfuscation_manager import ObfuscationManager


class Driver:

    def __init__(self):
        self.__serializer = Serializer()
        self.__obfuscator = ObfuscationManager()

    def process_file_to_video(self, file_path: str) -> str:
        # zip
        zipped_path = self.__zip_it(file_path)
        # serialize
        cover_vid_path = self.__choose_cover_video(zipped_path)
        out_vid_path = f"{zipped_path}.mp4"
        self.__serializer.serialize(open(zipped_path, 'r'), cover_vid_path, out_vid_path)
        # obfuscate
        out_vid_path = self.__obfuscator.obfuscate(out_vid_path, cover_vid_path)
        return out_vid_path

    def process_video_to_file(self, video_path: str) -> str:
        # untangle
        serialized_file_as_video_path = self.__obfuscator.untangle(video_path)
        # deserialize
        zipped_file_path = self.__serializer._deserialize(serialized_file_as_video_path)
        # unzip
        unzipped_file_path = self.__unzip_it(zipped_file_path)
        return unzipped_file_path

    def __zip_it(self, file_to_upload_path: str) -> str:
        zipped_path = f"{file_to_upload_path}.zip"
        with zipfile.ZipFile(zipped_path, 'w', zipfile.ZIP_DEFLATED) as zippity:
            zippity.write(file_to_upload_path, basename(file_to_upload_path))
        return zipped_path

    def __choose_cover_video(self, zipped_path: str) -> str:
        approx_frames = os.path.getsize(zipped_path) // self.__serializer.chunk_size
        raise NotImplemented()

    def __unzip_it(self, zipped_file_path: str) -> str:
        unzipped_path = zipped_file_path[:zipped_file_path.rfind('.')]
        with zipfile.ZipFile(zipped_file_path, 'r') as zippity:
            zippity.extractall(unzipped_path)
        return unzipped_path
