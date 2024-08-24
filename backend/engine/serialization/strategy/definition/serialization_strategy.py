from abc import ABC, abstractmethod

import numpy as np
from multipledispatch import dispatch


class SerializationStrategy(ABC):
    def __init__(self, fourcc: str = "RGBA", out_format: str = "avi"):
        # W, H
        self.dims: tuple[int, int] = None
        self.dims_multiplied: int = 0
        self.chunk_size: int = 0
        # self.frames_amount: int = 0
        self.bytes_2_pixels_ratio: float = 0
        self.fourcc: str = fourcc
        self.out_format: str = out_format

    @abstractmethod
    def serialize(self, bytes_chunk, frames_collection, i, context=None):
        pass

    @abstractmethod
    def serialize_bytes_chunk(self, bytes_chunk, index, context=None):
        pass

    @abstractmethod
    def deserialize(self, bytes_amount_to_read, encrypted_frame: np.ndarray, bytes_collection, i, context=None):
        pass

    @abstractmethod
    def deserialize_frame(self, bytes_amount_to_read: int, encrypted_frame: np.ndarray, i: int, context=None)->np.ndarray:
        pass

    @dispatch()
    def calculate_chunk_size(self):
        if self.chunk_size <= 0:
            self.chunk_size = int(self.dims_multiplied / self.bytes_2_pixels_ratio)
        if self.chunk_size == 0:
            raise Exception(
                f"chuck size cannot be zero: dims- {self.dims_multiplied}; ratio- {self.bytes_2_pixels_ratio}")
        return self.chunk_size

    @dispatch(np.int32)
    def calculate_chunk_size(self, dims_multiplied: int) -> int:
        chunk_size = int(dims_multiplied / self.bytes_2_pixels_ratio);
        if chunk_size == 0:
            raise Exception(
                f"chuck size cannot be zero: dims- {dims_multiplied}; ratio- {self.bytes_2_pixels_ratio}")
        return chunk_size
