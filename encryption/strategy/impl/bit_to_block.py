import numpy as np

from encryption.constants import BYTES_PER_PIXEL
from encryption.strategy.definition.encryption_strategy import EncryptionStrategy


class BitToBlock(EncryptionStrategy):
    def __init__(self, block_size=4, fourcc: str = "RBGA", out_format: str = "avi"):
        super().__init__(fourcc, out_format)
        self.block_size = block_size
        self.bytes_2_pixels_ratio = 8 * block_size ** 2

    def __create_block_from_bytes(self, bytes_row):
        width, height = self.dims
        # repeat_amount_over_width = width // self.block_size
        # repeat_amount_over_height = height // self.block_size
        print("bytes_row", bytes_row.shape, bytes_row)
        bits_block_repeated_over_width = np.repeat(bytes_row, self.block_size * BYTES_PER_PIXEL, axis=0)
        bits_block_repeated_over_height = np.tile(bits_block_repeated_over_width, (self.block_size, 1))
        return bits_block_repeated_over_height

    def __build_bytes_matrix(self, bytes_chunk):
        # bits = np.unpackbits(np.frombuffer(bytes_chunk, dtype=np.uint8))
        width, height = self.dims
        bytes_list = list(bytes_chunk)
        bytes_amount = len(bytes_list)
        row_amount = int(np.ceil(bytes_amount * self.block_size / width))
        bytes_array = np.zeros(row_amount * width // self.block_size, dtype=np.uint8)
        bytes_array[:bytes_amount] = bytes_list
        bytes_as_rows = bytes_array.reshape(row_amount, -1)
        return bytes_as_rows

    def encrypt(self, bytes_chunk, frames_collection, i):
        print(f"####### encrypt {i} #######")
        print("original: ", len(bytes_chunk), np.array(list(bytes_chunk)))
        width, height = self.dims
        # bits = np.unpackbits(np.frombuffer(bytes_chunk, dtype=np.uint8))
        num_blocks = len(bytes_chunk)
        bytes_as_rows = self.__build_bytes_matrix(bytes_chunk)
        # create array block from bytes
        blocks_arr = np.apply_along_axis(self.__create_block_from_bytes,
                                         arr=bytes_as_rows, axis=1).reshape(-1, width, 3)
        # .reshape(-1, self.block_size * self.dims[0])
        # print(np.apply_along_axis(lambda block: print("block", block), arr=arr, axis=0))
        filled_frame = np.zeros((height, width, 3), dtype=np.uint8)
        filled_frame[:blocks_arr.shape[0], : blocks_arr.shape[1]] = blocks_arr
        # num_blocks = blocks_arr.shape[0]
        # for row, col, idx in self.position_generator(num_blocks, width):
        #     frame[row: row + block_size, col:col + block_size] = blocks_arr[idx]

        # return frame
        frames_collection[i] = filled_frame
        self.__save_frame_to_csv(False, True, i, frames_collection)

        # Decrypt
        blocks = filled_frame.reshape(-1, self.block_size, 3)
        [print("block", np.unique(blocks[i, :, :, :])) for i in range(num_blocks)]
        blocks_mean = np.array([np.average(block) for block in blocks], dtype=np.uint8)

        print("uniq", np.unique(blocks_mean))
        # decoded_bits = np.where(blocks_mean > 127, 1, 0)[:bytes_amount_to_read * 8]

        # print(f"bits {i}-size {decoded_bits.shape}:", decoded_bits)

        # decoded_bits = np.apply_along_axis(lambda block: print("block", block), arr=blocks, axis=3)
        # bytes_collection[i] = np.packbits(decoded_bits)
        # print("result: ", bytes_collection[i].shape, bytes_collection[i])
        #
        # bits = np.frombuffer(bytes_chunk, dtype=np.uint8)
        # print("bits:", bits.shape, bits)
        #
        # width, height = self.dims
        # block_size = self.block_size
        # print(f"bits {i}-size {bits.shape}:", bits)
        # blocks_arr = np.array(
        #     list(
        #         map(
        #             lambda bit:
        #             np.full((block_size, block_size, 3), dtype=np.uint8, fill_value=bit * MAX_UINT8),
        #             bits
        #         )
        #     )
        # )

    def __calculate_position(self, block, width):
        block_size = self.block_size
        row = ((block_size * block) // width) * block_size
        col = ((block_size * block) % width)
        return row, col

    def __save_frame_to_csv(self, is_print_in_binary, is_encrypted, i, frames_collection):

        if (i == 0):
            print(f"saving frame {i} to file...")
            str_array = []
            if is_print_in_binary:
                array = np.vectorize(np.binary_repr)(np.copy(frames_collection[i]), width=8)
            else:
                array = frames_collection[i]
            for row in range(self.dims[1]):
                for col in range(self.dims[0]):
                    str_array.append(str(array[row, col]))

            np.savetxt(
                f"../output_files/frames_collection[0]_{'encrypted' if is_encrypted else 'decrypted'}_{self.fourcc}.csv",
                np.array(str_array).reshape(self.dims[1], self.dims[0]), delimiter=",", fmt="%s")

    def position_generator(self, num_blocks, width):
        for block in range(num_blocks):
            yield *self.__calculate_position(block, width), block

    def decrypt(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        print(f"####### decrypt {i} #######")
        block_size = self.block_size
        width = self.dims[0]
        num_blocks = bytes_amount_to_read * 8
        ########

        # blocks = np.array(
        #     [
        #         encrypted_frame[row: row + block_size, col: col + block_size] for row, col, _
        #         in self.position_generator(num_blocks, width)
        #     ]
        # )
        # Create a NumPy array

        blocks = encrypted_frame.reshape(-1, self.block_size, 3)

        # print(np.apply_along_axis(lambda block: print("block", block), arr=arr, axis=0))

        # decoded_bits = np.array(list(map(lambda block: 1 if np.mean(block) > 127 else 0, blocks)), dtype=np.uint8)
        blocks_mean = np.array([np.average(block) for block in blocks], dtype=np.uint8)
        print("uniq", np.unique(blocks_mean))
        decoded_bits = np.where(blocks_mean > 127, 1, 0)[:bytes_amount_to_read * 8]

        print(f"bits {i}-size {decoded_bits.shape}:", decoded_bits)

        # decoded_bits = np.apply_along_axis(lambda block: print("block", block), arr=blocks, axis=3)
        bytes_collection[i] = np.packbits(decoded_bits)
        print("result: ", bytes_collection[i].shape, bytes_collection[i])
# btb = BitToBlock(fourcc="RGBA", out_format="avi")
# frame = btb.encrypt(b'GAL AVIEZRI G.AVIEZRI@gmail.comdsfdsdfsfsfdsdfsdfdsfsdfsdfsdfsdf', [], 0)
# btb.decrypt(31, frame, [], 0)
