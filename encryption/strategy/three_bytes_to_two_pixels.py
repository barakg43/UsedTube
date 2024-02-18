from strategy.strategy import EncryptionStrategy

class ThreeBytesToTwoPixels(EncryptionStrategy):
    def __init__(self):
        super().__init__()
        self.bytes_2_pixels_ratio = 3/2
    
    def encrypt(self, bytes_chunk):
        return super().encrypt(bytes_chunk)
    
    def decrypt(self):
        return super().decrypt()