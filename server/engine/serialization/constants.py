import os
from pathlib import Path

ENGINE_ROOT = Path(os.path.dirname(__file__)).parent
SERIALIZE_LOGGER = "EncryptionLogger"
DESERIALIZE_LOGGER = "DecryptionLogger"
GENERAL_LOGGER = "GeneralLogger"
BITS_PER_BYTE = 8
BYTES_PER_PIXEL = 3
IS_WRITING_LOGS_TO_CONSOLE = True
