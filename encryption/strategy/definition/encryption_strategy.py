from abc import ABC, abstractmethod

import numpy as np


class EncryptionStrategy(ABC):
    def __init__(self, fourcc: str = "RGBA", out_format: str = "avi"):
        # W, H
        self.dims: tuple[int, int] = None
        self.dims_multiplied: int = 0
        self.chunk_size: int = 0
        self.bytes_2_pixels_ratio: float = 0
        self.fourcc: str = fourcc
        self.out_format: str = out_format

    @abstractmethod
    def encrypt(self, bytes_chunk, frames_collection, i):
        pass

    @abstractmethod
    def decrypt(self, bytes_amount_to_read, encrypted_frame: np.ndarray, bytes_collection, i):
        pass

    def calculate_chunk_size(self):
        if self.chunk_size <= 0:
            self.chunk_size = int(self.dims_multiplied / self.bytes_2_pixels_ratio)
        return self.chunk_size
