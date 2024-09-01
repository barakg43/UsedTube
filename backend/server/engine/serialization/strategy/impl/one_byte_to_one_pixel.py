from typing import override

import numpy as np

from engine.serialization.strategy.definition.serialization_strategy import SerializationStrategy


class OneByteToOnePixel(SerializationStrategy):

    def __init__(self):
        super().__init__()
        self.bytes_2_pixels_ratio = 1
        self.fourcc = "RGBA"
        self.out_format = "OtO.avi"

    @override
    def serialize(self, bytes_chunk, frames_collection, i):
        chunk_as_grayscale_frame = self.create_2d_image_frame_grayscale(bytes_chunk)
        frames_collection[i] = self.create_3d_frame_from_gray_frame(chunk_as_grayscale_frame)

    @override
    def deserialize(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        bytes_as_pixels2d_list3 = np.split(encrypted_frame, 3, axis=2)
        bytes_collection[i] = bytes_as_pixels2d_list3[0].reshape(-1)[:bytes_amount_to_read]

    def create_2d_image_frame_grayscale(self, file_bytes_chunk):
        filled_array = np.zeros(self.dims_multiplied, dtype=np.uint8)
        filled_array[:len(file_bytes_chunk)] = list(file_bytes_chunk)
        bytes_as_pixels2d = np.array(filled_array).reshape(self.dims[1], self.dims[0])
        return bytes_as_pixels2d

    def create_3d_frame_from_gray_frame(self, bytes_as_pixels2d):
        pixels_as_frame = np.dstack([bytes_as_pixels2d, bytes_as_pixels2d, bytes_as_pixels2d])
        return pixels_as_frame


PROTO_1B_1P = OneByteToOnePixel()
