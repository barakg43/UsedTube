import time
import numpy as np
from encryption.constants import BYTES_PER_PIXEL, BITS_PER_BYTE
from encryption.strategy.definition.encryption_strategy import EncryptionStrategy
import matplotlib.pyplot as plt

def show(frame):
    plt.imshow(frame)
    plt.show()

class BitToBlock(EncryptionStrategy):
    def __init__(self, block_size=4, fourcc: str = "RBGA", out_format: str = "avi"):
        super().__init__(fourcc, out_format)
        self.block_size = block_size
        self.bytes_2_pixels_ratio = BITS_PER_BYTE * (block_size ** 2)

    def __create_blocks_from_bytes(self, bytes_row):
        block_size = self.block_size
        # repeat the bytes columns over the block size(block size:4) - [1,2,3,4] -> [1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4]
        bits_block_repeated_over_width = np.repeat(np.repeat(bytes_row, block_size, axis=0), block_size, axis=1)
        # repeat the bytes rows over the block size(block size:4)- [1,2,3,4] -> [[1,2,3,4] [1,2,3,4] [1,2,3,4] [1,2,3,4]])
        # bits_block_repeated_over_height = np.tile(bits_block_repeated_over_width, (self.block_size))
        return bits_block_repeated_over_width

    def __build_pixel_matrix(self, bytes_chunk):
        """
        Builds a bytes matrix from the given bytes chunk.

        Parameters:
            bytes_chunk (bytes): The input bytes chunk.

        Returns:
             numpy.ndarray: The bytes matrix built from the bytes chunk.

        :param bytes_chunk (bytes): The input bytes chunk.
        :return numpy.ndarray: The bytes matrix built from the bytes chunk.
        Example :
            bytes=[1 2 3 4 5 6 7 8 9 10]
            block_size=4
            width=16 bytes

            result will be : [[1 2 3 4]
                            [5 6 7 8]
                            [9 10 0 0]] as binary representation
        """
        bits = np.unpackbits(np.frombuffer(bytes_chunk, dtype=np.uint8))
        width, height = self.dims
        bytes_list = list(bytes_chunk)
        bytes_amount = len(bytes_list)
        row_amount = int(np.ceil(bytes_amount * self.block_size / width))
        bytes_array = np.zeros(row_amount * width // self.block_size, dtype=np.uint8)
        bytes_array[:bytes_amount] = bytes_list
        bytes_as_rows = bytes_array.reshape(row_amount, -1)
        return np.repeat(bytes_as_rows[:, :, np.newaxis], BYTES_PER_PIXEL, axis=2)

    def encrypt(self, bytes_chunk, frames_collection, i):
        begin_time = time.time()
        width, height = self.dims
        block_size = self.block_size
        # split the chuck to rows(row_size = width / block_size)
        pixels_matrix = self.__build_pixel_matrix(bytes_chunk)
        frame_of_blocks = np.repeat(np.repeat(pixels_matrix, block_size, axis=0), block_size, axis=1)
        # create empty frame
        filled_frame = np.zeros((height, width, BYTES_PER_PIXEL), dtype=np.uint8)
        # fill the frame with
        filled_frame[:frame_of_blocks.shape[0], : frame_of_blocks.shape[1]] = frame_of_blocks
        frames_collection[i] = filled_frame
        end_time = time.time()
        if i == 0:
            show(filled_frame)
        print(f"## Encrypt frame {i + 1}/{self.frames_amount:.0f} end  {end_time - begin_time:.2f} sec ##")


    def __save_frame_to_csv(self, is_print_in_binary, is_encrypted, i, array):

        if (i == 0):
            print(f"saving frame {i} to file...")
            str_array = []
            if is_print_in_binary:
                array = np.vectorize(np.binary_repr)(np.copy(array), width=BITS_PER_BYTE)
            for row in range(self.dims[1]):
                for col in range(self.dims[0]):
                    str_array.append(str(array[row, col]))

            np.savetxt(
                f"../output_files/frames_collection[0]_{'encrypted' if is_encrypted else 'decrypted'}_{self.fourcc}.csv",
                np.array(str_array).reshape(self.dims[1], self.dims[0]), delimiter=",", fmt="%s")


    def decrypt(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        begin_time = time.time()
        block_size = self.block_size
        width, height = self.dims
        block_amount_over_width = width // block_size
        block_amount_over_height = height // block_size
        blocks = encrypted_frame.reshape((block_amount_over_height, block_size, block_amount_over_width, block_size, 3))
        bytes_collection[i] = np.mean(blocks, axis=(1, 3, 4)).flatten().astype(np.uint8)[:bytes_amount_to_read]
        bytes_collection[i] = np.packbits(decoded_bits)
        decoded_bits = np.where(block_view > 127, 1, 0)[:bytes_amount_to_read * BITS_PER_BYTE]
        # convert the pixel color to bits
        # Calculate mean for each block

        block_view = np.lib.stride_tricks.as_strided(encrypted_frame, shape=shape, strides=strides)
        # Create a sliding window view

        strides = (block_size, block_size)
        shape = (num_blocks, 1)
        if i == 0 :
            show(encrypted_frame)
        # Calculate the shape and strides for the sliding window view

        # blocks_means = blocks_means.reshape(num_blocks, -1)
        # blocks_means = np.lib.stride_tricks.as_strided()
        #                         in self.position_generator(num_blocks, width)])
        # blocks_mean = np.array([np.mean(encrypted_frame[row: row + block_size, col:col + block_size]) for row, col, _
        #
        num_blocks = bytes_amount_to_read * 8
        width, height = self.dims
        end_time = time.time()

        print(f"## Decrypt frame {i + 1}/{self.frames_amount:.0f} end {end_time - begin_time:.2f} sec##")
