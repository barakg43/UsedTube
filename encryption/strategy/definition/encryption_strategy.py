from abc import ABC, abstractmethod


class EncryptionStrategy(ABC):
    def __init__(self):
        self.dims: tuple[int, int] = None
        self.dims_multiplied: int = None
        self.bytes_2_pixels_ratio: float = None
        self.fourcc: str = None
        self.out_format: str = None

    @abstractmethod
    def encrypt(self, bytes_chunk, frames_collection, i):
        pass

    @abstractmethod
    def decrypt(self, bytes_amount_to_read, encrypted_frame):
        pass

    def calculate_chunk_size(self):
        return int(self.dims_multiplied / self.bytes_2_pixels_ratio)
