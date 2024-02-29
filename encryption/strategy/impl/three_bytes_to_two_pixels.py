import numpy as np
from encryption.strategy.definition.encryption_strategy import EncryptionStrategy


PROTO_1B_TO_PIX = 0

class ThreeBytesToTwoPixels(EncryptionStrategy):
    def __init__(self):
        super().__init__()
        self.bytes_2_pixels_ratio = 3 / 2
        self.fourcc = "mp4v"
        self.out_format = ".mp4"
        self.bytes_buffer = []

    def encrypt(self, bytes_chunk):
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

        frame = np.zeros((*self.dims, 3), dtype=np.uint8)




    def decrypt(self, bytes_amount_to_read, encrypted_frame):
        pass


PROTO_3B_TO_2PIX = ThreeBytesToTwoPixels()