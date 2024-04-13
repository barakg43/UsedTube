import logging
import logging.handlers
import os
import queue
import threading
import constants as c

LOG_DIR = c.ENGINE_ROOT / "logs"
if not os.path.exists(LOG_DIR):
    os.mkdir(LOG_DIR)
ENCRYPTION_LOGS = f"{LOG_DIR}/encrypt.log"
DECRYPTION_LOGS = f"{LOG_DIR}/decrypt.log"
GENERAL_LOGS = f"{LOG_DIR}/general.log"
formatter = logging.Formatter('%(asctime)s %(name)s %(levelname)s ### %(message)s', datefmt="%Y-%m-%d %H:%M:%S")


def init_logger(log_path, logger_name):
    f_handler = logging.FileHandler(log_path)

    f_handler.setFormatter(formatter)

    logger = logging.getLogger(logger_name)

    logger.addHandler(f_handler)

    logger.setLevel(logging.DEBUG)


init_logger(GENERAL_LOGS, c.GENERAL_LOGGER)


def init_logger_async(log_path, logger_name):
    logger = logging.getLogger(logger_name)

    logger.setLevel(logging.DEBUG)

    log_queue = queue.Queue()

    queue_handler = logging.handlers.QueueHandler(log_queue)

    def process_log_records():
        nonlocal log_queue
        while True:
            try:
                record = log_queue.get(block=True, timeout=None)
                with open(log_path, 'a') as file:
                    file.write(formatter.format(record) + '\n')
            except Exception as e:
                logging.getLogger(c.GENERAL_LOGGER).critical(e.with_traceback())
            finally:
                log_queue.task_done()

    listener_thread = threading.Thread(target=process_log_records)
    listener_thread.daemon = True
    listener_thread.start()

    logger.addHandler(queue_handler)


init_logger_async(ENCRYPTION_LOGS, c.SERIALIZE_LOGGER)
init_logger_async(DECRYPTION_LOGS, c.DESERIALIZE_LOGGER)
