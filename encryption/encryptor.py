from typing import IO
import cv2
import numpy as np
import os
from encryption.strategy.definition.encryption_strategy import EncryptionStrategy
from multiprocessing.pool import ThreadPool

"""
CHUNK_SIZE SHOULD BE CALCULATED ONCE, BASED ON ENCRYPTION METHOD WE WILL CHOOSE
IF ONLY ONE COVER VIDEO IS USED, METADATA SHOULD ALSO BE RETRIEVED ONCE
"""


class Encryptor:
    def __init__(self, strategy: EncryptionStrategy):
        self.file_size:int = None
        self.encoding:int = None
        self.fps:int = None
        self.chunk_size:int = None
        self.strategy:EncryptionStrategy = strategy
        self.workers = ThreadPool(25) # Arbitrary; Inspired by FPS
        
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
        output_video = cv2.VideoWriter(out_vid_path, self.encoding, self.fps, self.strategy.dims)

        if self.chunk_size is None:
            self.chunk_size = self.strategy.calculate_chunk_size()

        encrypted_frames = [None] * np.ceil(self.file_size / self.chunk_size)
        # read chunks sequentially and start strategy.encrypt
        file_bytes_chunk = file_to_encrypt.read(self.chunk_size)
        chunk_number = 0
        while file_bytes_chunk:
            # strategy.encrypt returns an encrypted frame
            self.workers.join()
            # ^^^^^^^^^^^^^^^^ U STOPPED HERE
            self.strategy.encrypt(file_bytes_chunk, encrypted_frames, chunk_number)
            # read next chunk
            file_bytes_chunk = file_to_encrypt.read(self.chunk_size)

        for frame in encrypted_frames:
            output_video.write(frame)
        # Closes all the video sources
        cover_video.release()
        output_video.release()

    def decrypt(self, encrypted_file_as_video_path, file_size, decrypted_file):
        enc_file_videocap = cv2.VideoCapture(encrypted_file_as_video_path)
        self.get_cover_video_metadata(enc_file_videocap)

        bytes_left_to_read = file_size

        if self.chunk_size is None:
            self.chunk_size = self.strategy.calculate_chunk_size()

        while bytes_left_to_read > 0:
            ret, encrypted_frame = enc_file_videocap.read()
            if not ret:
                break
            bytes_amount_to_read = self.chunk_size if bytes_left_to_read > self.strategy.dims_multiplied else bytes_left_to_read

            bytes_left_to_read -= bytes_amount_to_read
            file_bytes_chunk = self.strategy.decrypt(bytes_amount_to_read, encrypted_frame)

            decrypted_file.write(bytes(file_bytes_chunk.tolist()))

        enc_file_videocap.release()
        cv2.destroyAllWindows()
