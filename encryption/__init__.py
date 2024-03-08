import logging
import encryption.constants as c

LOG_DIR = "../../"+"../logs/"
ENCRYPTION_LOGS = f"{LOG_DIR}encrypt.log"
DECRYPTION_LOGS = f"{LOG_DIR}decrypt.log"
formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s ### %(message)s', datefmt="%Y-%m-%d %H:%M:%S")


def init_logger(log_path, logger_name):
    f_handler = logging.FileHandler(log_path)
    f_handler.setFormatter(formatter)
    logger = logging.getLogger(logger_name)
    logger.addHandler(f_handler)
    logger.setLevel(logging.DEBUG)


init_logger(ENCRYPTION_LOGS, c.ENCRYPT_LOGGER)
init_logger(DECRYPTION_LOGS, c.DECRYPT_LOGGER)
