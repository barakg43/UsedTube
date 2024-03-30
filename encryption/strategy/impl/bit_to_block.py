from typing import override

import numpy as np

from encryption.strategy.definition.encryption_strategy import EncryptionStrategy

###TEST
# import matplotlib.pyplot as plt
####


class BitToBlock(EncryptionStrategy):
    def __init__(self, block_size=4):
        super().__init__()
        self.block_size = block_size
        ####TEST
        self.dims = (1280, 720)

    def encrypt(self, bytes_chunk, frames_collection, i):
        bits = np.unpackbits(np.frombuffer(bytes_chunk, dtype=np.uint8))
        width, height = self.dims
        block_size = self.block_size
        blocks_arr = np.array(list(map(lambda bit:
                                       np.full((block_size, block_size,3), dtype=np.uint8, fill_value=bit*255),
                                       bits)))

        frame = np.zeros((height, width, 3), dtype=np.uint8)

        num_blocks = blocks_arr.shape[0]
        for block in range(num_blocks):
            row = ((block_size * block) // width) * block_size
            col = ((block_size * block) % width)
            if col + block_size > width:
                row += block_size
                col = 0
            frame[row: row+block_size, col:col+block_size] = blocks_arr[block]

        # plt.imshow(frame, extent=[0, width, height, 0])
        # plt.axis('off')  # Turn off axis
        # plt.show()

        frames_collection[i] = frame



    def decrypt(self, bytes_amount_to_read, encrypted_frame, bytes_collection, i):
        #TODO: IMPLEMENT
        pass

    @override
    def calculate_chunk_size(self):
        pass



btb = BitToBlock()
btb.encrypt(b'abascji1o2!@#fasxf123asdffga2312qarfasf1354yrhgq2123',[], 0)
