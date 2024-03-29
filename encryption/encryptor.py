import concurrent.futures
import hashlib
import logging
import os
from concurrent.futures import ThreadPoolExecutor, wait
from typing import IO

import cv2
import numpy as np

from encryption.constants import ENCRYPT_LOGGER, DECRYPT_LOGGER
from encryption.strategy.definition.encryption_strategy import EncryptionStrategy

encrypt_logger = logging.getLogger(ENCRYPT_LOGGER)
decrypt_logger = logging.getLogger(DECRYPT_LOGGER)
"""
CHUNK_SIZE SHOULD BE CALCULATED ONCE, BASED ON ENCRYPTION METHOD WE WILL CHOOSE
IF ONLY ONE COVER VIDEO IS USED, METADATA SHOULD ALSO BE RETRIEVED ONCE
"""


class Encryptor:
    def __init__(self, strategy: EncryptionStrategy):
        self.file_size: int = 0
        self.encoding: int = 0
        self.fps: int = 0
        self.chunk_size: int = 0
        self.strategy: EncryptionStrategy = strategy
        self.workers: ThreadPoolExecutor = ThreadPoolExecutor(25)  # Arbitrary; Inspired by FPS
        self.enc_logger = logging.getLogger(ENCRYPT_LOGGER)
        self.dec_logger = logging.getLogger(DECRYPT_LOGGER)
        self.original_sha256 = ""

    def get_cover_video_metadata(self, cover_video):
        self.strategy.dims = (
            int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT))
        )
        self.fps = cover_video.get(cv2.CAP_PROP_FPS)
        self.encoding = cv2.VideoWriter.fourcc(*self.strategy.fourcc)
        self.strategy.dims_multiplied = np.multiply(*self.strategy.dims)

    def collect_metadata(self, file_br, cover_video):
        self.get_cover_video_metadata(cover_video)
        fd = file_br.fileno()
        self.file_size = os.fstat(fd).st_size

    def encrypt(self, file_to_encrypt: IO, cover_video_path: str, out_vid_path: str):
        """"
        :param out_vid_path: string path
        :param cover_video_path:
        :parameter file_to_encrypt an open file descriptor in 'rb' to the file
        """

        cover_video = cv2.VideoCapture(cover_video_path)
        self.collect_metadata(file_to_encrypt, cover_video)

        if self.chunk_size == 0:
            self.enc_logger.debug("calculating chunk size")
            self.chunk_size = self.strategy.calculate_chunk_size()

        encrypted_frames = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=object)
        futures = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=concurrent.futures.Future)
        self.enc_logger.debug(f"about to process {len(futures)} chunks")
        # read chunks sequentially and start strategy.encrypt
        bytes_chunk = file_to_encrypt.read(self.chunk_size)

        chunk_number = 0
        while bytes_chunk:
            # strategy.encrypt returns an encrypted frame
            futures[chunk_number] = self.workers.submit(self.strategy.encrypt, bytes_chunk, encrypted_frames,
                                                        chunk_number)
            #  use encrypt without ThreadPool
            # futures[chunk_number] = self.strategy.encrypt(bytes_chunk, encrypted_frames,
            #                                               chunk_number)
            # read next chunk
            chunk_number += 1
            bytes_chunk = file_to_encrypt.read(self.chunk_size)
            self.enc_logger.debug(f"encryptor submitted chunk #{chunk_number} for encryption")

        self.enc_logger.debug(f"total of {chunk_number} chunks were submitted to workers")

        wait(futures)
        self.enc_logger.debug("waiting for workers to finish processing chunks...")
        output_video = cv2.VideoWriter(out_vid_path, self.encoding, self.fps, self.strategy.dims)  # TODO: fix encoding
        for frame in encrypted_frames:
            output_video.write(frame)

        # Closes all the video sources
        cover_video.release()
        output_video.release()
        cv2.destroyAllWindows()

    def generateSha256ForFile(self, file_bytes: IO):
        sha256Hashed = hashlib.file_digest(file_bytes, 'sha256').hexdigest()
        return sha256Hashed

    def decrypt(self, encrypted_file_as_video_path, file_size, decrypted_file):
        # CHANGE THE IO OPERATIONS TO BE SEQUENTIAL
        # IMPLEMENT CONCURRENCY HERE ASWELL

        enc_file_videocap = cv2.VideoCapture(encrypted_file_as_video_path)
        self.get_cover_video_metadata(enc_file_videocap)

        bytes_left_to_read = file_size

        decrypted_bytes = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=object)
        futures = np.empty(int(np.ceil(self.file_size / self.chunk_size)), dtype=concurrent.futures.Future)

        if self.chunk_size is None:
            self.dec_logger.debug("calculating chunk size...")
            self.chunk_size = self.strategy.calculate_chunk_size()
        self.dec_logger.debug(f"about to process {len(futures)} frames")
        frame_number = 0
        while bytes_left_to_read > 0:
            ret, encrypted_frame = enc_file_videocap.read()
            if not ret:
                break

            bytes_amount_to_read = self.calculate_total_bytes(bytes_left_to_read)
            bytes_left_to_read -= bytes_amount_to_read
            #  use decrypt without ThreadPool
            # futures[frame_number] = self.strategy.decrypt(bytes_amount_to_read, encrypted_frame,
            #                                               decrypted_bytes, frame_number)
            futures[frame_number] = self.workers.submit(self.strategy.decrypt, bytes_amount_to_read, encrypted_frame,
                                                        decrypted_bytes, frame_number)
            self.dec_logger.debug(f"encryptor submitted chunk #{frame_number} for decryption")
            frame_number += 1
        self.enc_logger.debug(f"total of {frame_number} frames were submitted to workers")

        wait(futures)

        for _bytes in decrypted_bytes:
            decrypted_file.write(bytes(_bytes.tolist()))

        enc_file_videocap.release()
        cv2.destroyAllWindows()

    def calculate_total_bytes(self, bytes_left_to_read):
        bytes_amount_to_read = self.chunk_size if bytes_left_to_read > self.strategy.dims_multiplied else bytes_left_to_read
        return bytes_amount_to_read
