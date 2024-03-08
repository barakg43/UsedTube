from typing import override
import numpy as np
from encryption.strategy.definition.encryption_strategy import EncryptionStrategy

class ThreeBytesToTwoPixels(EncryptionStrategy):
    def __init__(self):
        super().__init__()
        self.bytes_2_pixels_ratio = 3 / 2
        self.fourcc = "mp4v"
        self.out_format = ".mp4"

    @override
    def encrypt(self, bytes_chunk, frames_collection, i):
        """
        given 3 Bytes A,B,C they will be encoded into 2 adjacent pixels P1, P2
        in the following manner:
        P1 = (A,B,C)
        P2 = (Ahalf_reverse, Bhalf_reverse, ...)
        Byte_half_reverse is as following:
        given a byte = (10010101)
        byte_half_reverse = (01011001)
        switch the 4 first bits with 4 last bits
        the reassembly of the a byte will be as follows:
        ByteA = P1[0][0-3] | (P2[0][0-3] >> 4 )
        """
        # next_pixel = 0
        # frame = np.zeros((*self.dims, 3), dtype=np.uint8)
        # for j in range(0, len(bytes_chunk), 3):
        #     three_bytes = bytes_chunk[j:j + 3]
        #     # transform to two pixels
        #     frame[next_pixel // 0, next_pixel % self.dims[0]] = three_bytes
        #     next_pixel += 1
        #     frame[next_pixel // 0, next_pixel % self.dims[0]] = self.transform_bytes(three_bytes)
        #     next_pixel += 1
        #
        # frames_collection[i] = frame
        frame = np.zeros((*self.dims, 3), dtype=np.uint8)
        chunks = np.reshape(bytes_chunk, (-1, 3))
        transformed_chunks = np.apply_along_axis(self.transform_bytes, 1, chunks)
        pixels = transformed_chunks.flatten()
        frame[:pixels.shape[0]] = np.reshape(pixels, frame.shape)
        frames_collection[i] = frame
    @override
    def decrypt(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        pass

    def transform_bytes(self, three_bytes):
        return np.apply_along_axis(self.transform_byte, 0, three_bytes)

    def transform_byte(self, byte):
        leftmost = (byte & 0xF0) >> 4
        rightmost = (byte & 0x0F) << 4
        return rightmost | leftmost



PROTO_3B_TO_2PIX = ThreeBytesToTwoPixels()
print(PROTO_3B_TO_2PIX.transform_byte(0b11010000))
