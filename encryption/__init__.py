import logging
import os
import sys

import encryption.constants as c

LOG_DIR = c.PROJECT_ROOT / "logs"
if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
ENCRYPTION_LOGS = f"{LOG_DIR}/encrypt.log"
DECRYPTION_LOGS = f"{LOG_DIR}/decrypt.log"
formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s ### %(message)s', datefmt="%Y-%m-%d %H:%M:%S")


def init_logger(log_path, logger_name):
    f_handler = logging.FileHandler(log_path)
    f_handler.setFormatter(formatter)
    logger = logging.getLogger(logger_name)
    logger.addHandler(f_handler)
    logger.setLevel(logging.DEBUG)


init_logger(ENCRYPTION_LOGS, c.ENCRYPT_LOGGER)
init_logger(DECRYPTION_LOGS, c.DECRYPT_LOGGER)

# openh264_dir = c.PROJECT_ROOT / '.venv/Lib' # Update this with the actual path
# openh264_path = openh264_dir / 'openh264-1.8.0-win64.dll'
# # Add the directory to the PATH
#
# if openh264_path.as_posix() not in sys.path:
#     sys.path.append(openh264_path.as_posix())
#     os.environ['PATH'] += f'{openh264_dir.as_posix().replace('/', '\\')}'
#     # raise EnvironmentError("openh264-1.8.0-win64.dll is not found in Path, execute run.bat under 'install h264 codec'")
#     print(os.environ['PATH'])
#     pass