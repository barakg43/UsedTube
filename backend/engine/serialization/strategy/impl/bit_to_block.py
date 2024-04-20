import logging
import time
import matplotlib.pyplot as plt
import numpy as np
from engine.constants import BYTES_PER_PIXEL, BITS_PER_BYTE
from engine.serialization.strategy.definition.serialization_strategy import SerializationStrategy
from engine.constants import SERIALIZE_LOGGER, DESERIALIZE_LOGGER

def show(frame):
    plt.imshow(frame)
    plt.show()


class BitToBlock(SerializationStrategy):
    def __init__(self, block_size=4, fourcc: str = "RBGA", out_format: str = "avi"):
        super().__init__(fourcc, out_format)
        self.block_size = block_size
        self.bytes_2_pixels_ratio = BITS_PER_BYTE * (block_size ** 2)
        self.enc_logger = logging.getLogger(SERIALIZE_LOGGER)
        self.dec_logger = logging.getLogger(DESERIALIZE_LOGGER)

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

            result will be : [[0b1 0b2 0b3 0b4]
                            [0b5 0b6 0b7 0b8]
                            [0b9 0b10 0b0 0b0]] as binary representation
        """
        bits = np.unpackbits(np.frombuffer(bytes_chunk, dtype=np.uint8))
        width, height = self.dims
        bits_amount = bits.shape[0]
        row_amount = int(np.ceil(bits_amount * self.block_size / width))
        bytes_array = np.zeros(row_amount * width // self.block_size, dtype=np.uint8)
        bytes_array[:bits_amount] = bits * 255
        bytes_as_rows = bytes_array.reshape(row_amount, -1)
        return np.repeat(bytes_as_rows[:, :, np.newaxis], BYTES_PER_PIXEL, axis=2)

    def serialize(self, bytes_chunk, frames_collection, i):
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
        self.enc_logger.debug(f"Encrypt frame {i + 1}/{self.frames_amount:.0f} end  {end_time - begin_time:.2f} sec")


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

    def deserialize(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        begin_time = time.time()
        block_size = self.block_size
        width, height = self.dims
        block_amount_over_width = width // block_size
        block_amount_over_height = height // block_size
        blocks = encrypted_frame.reshape((block_amount_over_height, block_size, block_amount_over_width,  block_size, 3))
        blocks_means = np.mean(blocks, axis=(1, 3, 4)).flatten().astype(np.uint8)[:bytes_amount_to_read * BITS_PER_BYTE]
        decoded_bits = np.where(blocks_means > 127, 1, 0)
        bytes_collection[i] = np.packbits(decoded_bits)
        end_time = time.time()
        self.dec_logger.debug(f"Decrypt frame {i + 1}/{self.frames_amount:.0f} end {end_time - begin_time:.2f} sec")
