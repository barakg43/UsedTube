from abc import ABC, abstractmethod


class EncryptionStrategy(ABC):
    def __init__(self):
        self.dims = None
        self.dims_multiplied = None
        self.bytes_2_pixels_ratio = None
        self.fourcc = None
    
    @abstractmethod
    def encrypt(self, bytes_chunk):
        pass
    
    @abstractmethod
    def decrypt(self):
        pass
    
    def calculate_chunk_size(self):
        self.chunk_size = self.dims_multiplied // self.bytes_2_pixels_ratio
        return self.chunk_size
    