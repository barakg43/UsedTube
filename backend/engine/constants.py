import os
from pathlib import Path

ENGINE_ROOT = Path(os.path.dirname(__file__))
ARTIFACTS_DIR = Path(os.path.join(ENGINE_ROOT, 'artifacts'))
TEST_RESOURCES_DIR = Path(os.path.join(ARTIFACTS_DIR, 'test_resources'))
TEST_OUTPUT_DIR = Path(os.path.join(ARTIFACTS_DIR, 'test_output_files'))
COVER_VIDEOS_DIR = Path(os.path.join(ARTIFACTS_DIR, 'cover_videos'))
FILES_READY_FOR_STORAGE_DIR = Path(os.path.join(ARTIFACTS_DIR, 'awaiting_storage'))
FILES_READY_FOR_RETRIEVAL_DIR = Path(os.path.join(ARTIFACTS_DIR, 'awaiting_retrieval'))
ITEMS_READY_FOR_PROCESSING = Path(os.path.join(ARTIFACTS_DIR, 'downloaded_preprocessed'))
TMP_WORK_DIR = Path(os.path.join(ARTIFACTS_DIR, 'tmp'))
YOUTUBE_CREDENTIALS = Path(os.path.join(ENGINE_ROOT, 'uploader', 'YouTube', 'credentials.json'))
YOUTUBE_TOKEN = Path(os.path.join(ENGINE_ROOT, 'uploader', 'YouTube', 'token.json'))
DIRS = [
    ARTIFACTS_DIR,
    TEST_RESOURCES_DIR,
    TEST_OUTPUT_DIR,
    COVER_VIDEOS_DIR,
    FILES_READY_FOR_STORAGE_DIR,
    FILES_READY_FOR_RETRIEVAL_DIR,
    ITEMS_READY_FOR_PROCESSING,
    TMP_WORK_DIR
]

for _dir in DIRS:
    if not os.path.exists(_dir):
        os.mkdir(_dir)

SERIALIZE_LOGGER = "Serialization-Logger"
DESERIALIZE_LOGGER = "DeSerialization-Logger"
GENERAL_LOGGER = "GeneralLogger"
BITS_PER_BYTE = 8
BYTES_PER_PIXEL = 3
BIG_FILE = "big"
SMALL_FILE = "small"
_4_MiB = 4 * (2 ** 20)
SAMPLE_FILE_1 = "sample-file.pdf"
SAMPLE_FILE_2 = "sample-file2.pdf"
SAMPLE_FILE_3 = "sample-file3.pdf"
SAMPLE_FILE_4 = "sample-file4.pdf"
# sizes are for compressed
SF_1_SIZE = 358621
SF_2_SIZE = 48484244
SF_3_SIZE = 12233262
SF_4_SIZE = 5310879
IS_WRITING_TO_CONSOLE = False
DEBUG = True
UPLOAD_VIDEO_CHUNK_SIZE = 20 * (1024 * 1024)  # 20*1MB
MINIMUM_VIDEO_FRAME_AMOUNT = 5 *30 # 5 seconds * 30 fps
DEFAULT_BITRATE = 5000
