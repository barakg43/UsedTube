import os
from pathlib import Path

ENGINE_ROOT = Path(os.path.dirname(__file__))
ARTIFACTS_DIR = Path(os.path.join(ENGINE_ROOT, 'artifacts'))
TEST_RESOURCES_DIR = Path(os.path.join(ARTIFACTS_DIR, 'test_resources'))
TEST_OUTPUT_DIR = Path(os.path.join(ARTIFACTS_DIR, 'test_output_files'))
COVER_VIDEOS_DIR = Path(os.path.join(ARTIFACTS_DIR, 'cover_videos'))
FILES_READY_FOR_STORAGE_DIR = Path(os.path.join(ARTIFACTS_DIR, 'awaiting_storage'))
FILES_READY_FOR_RETRIEVAL_DIR = Path(os.path.join(ARTIFACTS_DIR, 'awaiting_retrieval'))
TMP_WORK_DIR = Path(os.path.join(ARTIFACTS_DIR, 'tmp'))
if not os.path.exists(TEST_OUTPUT_DIR):
    os.mkdir(TEST_OUTPUT_DIR)
SERIALIZE_LOGGER = "Serialization-Logger"
DESERIALIZE_LOGGER = "DeSerialization-Logger"
GENERAL_LOGGER = "GeneralLogger"
BITS_PER_BYTE = 8
BYTES_PER_PIXEL = 3
BIG_FILE = "big"
SMALL_FILE = "small"
_4_MiB = 4 * (2 ** 20)

IS_WRITING_TO_CONSOLE = False
DEBUG = True
