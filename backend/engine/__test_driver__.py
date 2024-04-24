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
            FILE_TO_SERIALIZE_PATH: (TEST_RESOURCES_DIR / "sample-file2.pdf").as_posix(),
            VIDEO_TO_DESERIALIZE_PATH: (FILES_READY_FOR_STORAGE_DIR / "f806bd7a-6454-4ac2-8569-5ca31a058d25.mp4").as_posix()
        }

        return paths_dict

    def test_file_to_video(self):
        paths_dict = self.paths_dict()
        driver = Driver()
        print(driver.process_file_to_video(paths_dict[FILE_TO_SERIALIZE_PATH])[1])
        pass

    def test_driver_video_to_file(self):
        paths_dict = self.paths_dict()
        driver = Driver()
        # sample-file2.pdf compressed size == 48484244
        # sample-file.pdf compressed size = 358621
        driver.process_video_to_file(paths_dict[VIDEO_TO_DESERIALIZE_PATH], 48484244)
        pass
