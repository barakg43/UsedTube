from collections import deque
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

        total_bytes_per_channel = np.multiply(*self.dims)
        frame = np.zeros((total_bytes_per_channel, 3), dtype=np.uint8)
        chunks = np.reshape(list(bytes_chunk), (-1, 3))
        transformed_chunks = np.apply_along_axis(self.transform_bytes, 1, chunks)
        combined_chunks = self.interleaving_two_np_arrays(chunks, transformed_chunks)
        pixels = combined_chunks.reshape((-1, 3))
        frame[:pixels.shape[0]] = pixels
        frames_collection[i] = frame.reshape((total_bytes_per_channel, 3))




    @override
    def decrypt(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        pixels = encrypted_frame.flatten()
        bytes_queue = deque()
        for pixel in pixels:
            bytes_queue.append(pixel >> 4)  # Get the leftmost 4 bits
            bytes_queue.append(pixel & 0x0F)  # Get the rightmost 4 bits
        bytes_list = []
        while bytes_queue:
            byte1 = bytes_queue.popleft()
            byte2 = bytes_queue.popleft()
            byte3 = bytes_queue.popleft()
            original_byte = (byte1 << 4) | byte2
            bytes_list.extend([original_byte, byte3])
        decrypted_bytes = bytes(bytes_list)[:bytes_amount_to_read]
        bytes_collection[i] = decrypted_bytes

    # def transform_bytes(self, three_bytes):
    #     print("before",three_bytes)
    #     # three_bytes[1]=self.transform_byte(three_bytes[1])
    #     after=np.apply_along_axis(self.transform_byte, 0, three_bytes)
    #     print("after",after)
    #     return after
    def interleaving_two_np_arrays(self, np_array1: np.array, np_array2: np.array):
        return np.ravel(np.column_stack((np_array1, np_array2)))

    def construct_byte_from_2_pixels(self, two_pixels_of_3bytes):
        # print("before", two_pixels_of_3bytes)
        pixel1 = two_pixels_of_3bytes[0]
        pixel2 = two_pixels_of_3bytes[1]
        print("pixel1", pixel1)
        # print("pixel2", pixel2)
        leftmost_pixel1 = pixel1 & 0xF0
        rightmost_pixel2 = pixel2 >> 4
        print(np.vectorize(np.binary_repr)(pixel1, width=8))
        print(np.vectorize(np.binary_repr)(pixel2, width=8))

        print(np.vectorize(np.binary_repr)(leftmost_pixel1 | rightmost_pixel2, width=8))
        # print(np.vectorize(np.binary_repr)(rightmost_pixel2, width=8))
        print("after", leftmost_pixel1 | rightmost_pixel2)
        return leftmost_pixel1 | rightmost_pixel2

    def transform_bytes(self, three_bytes):
        leftmost = (three_bytes & 0xF0) >> 4
        rightmost = (three_bytes & 0x0F) << 4
        return rightmost | leftmost


PROTO_3B_TO_2PIX = ThreeBytesToTwoPixels()
# print(PROTO_3B_TO_2PIX.transform_bytes(0b11010000))
