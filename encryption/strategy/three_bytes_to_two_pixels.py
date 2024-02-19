import numpy as np
from encryption.strategy.encryption_strategy import EncryptionStrategy


def create_blank_image(width, height):
    # Create a NumPy array representing a black image
    blank_image = np.zeros((height, width, 3), dtype=np.uint8)
    return blank_image

class ThreeBytesToTwoPixels(EncryptionStrategy):
    def __init__(self):
        super().__init__()
        self.bytes_2_pixels_ratio = 3 / 2
        self.fourcc = "MP4V"
        self.out_format = ".mp4"
        self.bytes_buffer = []

    def encrypt(self, bytes_chunk):


    def decrypt(self, bytes_amount_to_read, encrypted_frame):
        pass

