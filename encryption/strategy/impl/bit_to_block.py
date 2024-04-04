import numpy as np

from encryption.constants import MAX_UINT8
from encryption.strategy.definition.encryption_strategy import EncryptionStrategy


class BitToBlock(EncryptionStrategy):
    def __init__(self, block_size=4, fourcc: str = "RBGA", out_format: str = "avi"):
        super().__init__(fourcc, out_format)

        self.block_size = block_size
        self.bytes_2_pixels_ratio = 8 * block_size ** 2

    def encrypt(self, bytes_chunk, frames_collection, i):
        print(f"####### encrypt {i} #######")
        print("original: ", len(bytes_chunk), np.array(list(bytes_chunk)))

        bits = np.unpackbits(np.frombuffer(bytes_chunk, dtype=np.uint8))
        width, height = self.dims
        block_size = self.block_size
        print(f"bits {i}-size {bits.shape}:", bits)
        blocks_arr = np.array(
            list(
                map(
                    lambda bit:
                    np.full((block_size, block_size, 3), dtype=np.uint8, fill_value=bit * MAX_UINT8),
                    bits
                )
            )
        )

        frame = np.zeros((height, width, 3), dtype=np.uint8)

        num_blocks = blocks_arr.shape[0]
        for row, col, idx in self.position_generator(num_blocks, width):
            frame[row: row + block_size, col:col + block_size] = blocks_arr[idx]
        # return frame
        frames_collection[i] = frame

    def __calculate_position(self, block, width):
        block_size = self.block_size
        row = ((block_size * block) // width) * block_size
        col = ((block_size * block) % width)
        return row, col

    def save_frame_to_csv(self, is_encrypted, i, frames_collection):
        if (i == 0):
            print("save frame to file...")
            np.savetxt(
                f"../output_files/frames_collection[0]_{'encrypted' if is_encrypted else 'decrypted'}_{self.fourcc}.csv",
                np.vectorize(np.binary_repr)(np.copy(frames_collection[i]), width=8), delimiter=",")
            print("finish save frame to file...")

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
