import time
from typing import override

import numpy as np

from encryption.strategy.definition.encryption_strategy import EncryptionStrategy


class ThreeBytesToTwoPixels(EncryptionStrategy):
    def __init__(self):
        super().__init__()
        self.bytes_2_pixels_ratio = 3 / 2
        self.fourcc = "RGBA"
        self.out_format = ".avi"
        self.total_frame_number = 0

        # self.fourcc = "mp4v"
        # self.out_format = ".mp4"

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

        print(f" ------------------ ENCRYPT frame id: {i} ------------------")
        start_time = time.time()
        total_bytes_per_channel = np.multiply(*self.dims)
        frame = np.zeros((total_bytes_per_channel, 3), dtype=np.uint8)
        chunks = np.reshape(list(bytes_chunk), (-1, 3))
        transformed_chunks = self.swap_right_left_bits(chunks)
        combined_chunks = self.interleaving_two_np_arrays(chunks, transformed_chunks)
        pixels = combined_chunks.reshape((-1, 3))
        frame[:pixels.shape[0]] = pixels
        frames_collection[i] = frame.reshape((self.dims[1], self.dims[0], 3))
        total_time = time.time() - start_time
        print(f" total time to process frame {i}:{total_time:.4f} sec")
        self.total_frame_number += 1

    @override
    def decrypt(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        # frame_2chucks_group = encrypted_frame.reshape((-1, 2, 3))
        # reconstruct_frame_bytes = np.array(
        #     [self.construct_byte_from_2_pixels(two_pixels_of_3bytes) for two_pixels_of_3bytes in
        #      frame_2chucks_group])
        # bytes_collection[i] = reconstruct_frame_bytes.reshape(-1)[:bytes_amount_to_read]
        print(f" ------------------ DENCRYPT frame id: {i} ------------------")

        start_time = time.time()
        pixel_flatten = encrypted_frame.reshape((-1, 3))
        frame_2chucks_group = encrypted_frame.reshape((-1, 2, 3))
        original_pixels = pixel_flatten[::2]
        reversed_pixels = pixel_flatten[1::2]
        reconstruct_frame_bytes = np.array(self.construct_byte_from_2_pixels(original_pixels, reversed_pixels))
        bytes_collection[i] = reconstruct_frame_bytes.reshape(-1)[:bytes_amount_to_read]
        total_time = time.time() - start_time
        print(f" total time to process frame {i}:{total_time:.4f} sec")

    def interleaving_two_np_arrays(self, np_array1: np.array, np_array2: np.array):
        return np.ravel(np.column_stack((np_array1, np_array2)))

    def construct_byte_from_2_pixels(self, original_pixels, invert_pixels):
        leftmost_pixel1 = np.bitwise_and(original_pixels, 0xF0)
        rightmost_pixel2 = np.right_shift(invert_pixels, 4)
        return np.bitwise_or(leftmost_pixel1, rightmost_pixel2)

    def swap_right_left_bits(self, bytes_nparray: np.ndarray):
        leftmost = np.right_shift(bytes_nparray, 4)
        rightmost = np.left_shift(np.bitwise_and(bytes_nparray, 0x0F), 4)
        return np.bitwise_or(rightmost, leftmost)

    def transform_bytes(self, three_bytes):
        leftmost = (three_bytes & 0xF0) >> 4
        rightmost = (three_bytes & 0x0F) << 4
        return rightmost | leftmost


PROTO_3B_TO_2PIX = ThreeBytesToTwoPixels()
# print(PROTO_3B_TO_2PIX.transform_bytes(0b11010000))
