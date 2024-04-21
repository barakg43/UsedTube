import os.path
import unittest

from engine.constants import TEST_RESOURCES_DIR, FILES_READY_FOR_STORAGE_DIR, FILES_READY_FOR_RETRIEVAL_DIR
from engine.driver import Driver

FILE_TO_SERIALIZE_PATH: int = 0
VIDEO_TO_DESERIALIZE_PATH: int = 1
ZIPPED_FILE_TO_SERIALIZE_PATH: int = 2
class DriverTest(unittest.TestCase):
    def paths_dict(self):
        paths_dict = {
            FILE_TO_SERIALIZE_PATH: (TEST_RESOURCES_DIR / "sample-file.pdf").as_posix(),
            ZIPPED_FILE_TO_SERIALIZE_PATH: (TEST_RESOURCES_DIR / "sample-file.pdf.zip").as_posix(),
            VIDEO_TO_DESERIALIZE_PATH: (FILES_READY_FOR_STORAGE_DIR / "c6bcc67e-d342-4b33-8fff-85a8f4d5e6c4.mp4").as_posix()
        }

        return paths_dict

    def test_file_to_video(self):
        paths_dict = self.paths_dict()
        driver = Driver()
        driver.process_file_to_video(paths_dict[FILE_TO_SERIALIZE_PATH])
        pass

    def test_driver_video_to_file(self):
        paths_dict = self.paths_dict()
        driver = Driver()
        driver.process_video_to_file(paths_dict[VIDEO_TO_DESERIALIZE_PATH], os.path.getsize(paths_dict[ZIPPED_FILE_TO_SERIALIZE_PATH]))
        pass
