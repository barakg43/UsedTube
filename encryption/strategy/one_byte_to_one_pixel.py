from strategy.strategy import EncryptionStrategy
import numpy as np

class OneByteToOnePixel(EncryptionStrategy):
    
    def __init__(self):
        super().__init__()
        self.bytes_2_pixels_ratio = 1
        self.fourcc = "RGBA"
    
    def encrypt(self, file_bytes_chunk):
        chunk_as_grayscale_frame = self.create_2d_image_frame_grayscale(file_bytes_chunk)
        return self.create_3d_frame_from_gray_frame(chunk_as_grayscale_frame)
        
    def decrypt(self, bytes_amount_to_read, encrypted_frame):
        bytes_as_pixels2d_list3 = np.split(encrypted_frame, 3, axis=2)
        flattened_pixel_array = bytes_as_pixels2d_list3[0].reshape(self.chunk_size)[:bytes_amount_to_read]
        return flattened_pixel_array
        pass
    
    def create_2d_image_frame_grayscale(self, file_bytes_chunk):
        filled_array = np.zeros(self.dims_multiplied, dtype=np.uint8)
        filled_array[:len(file_bytes_chunk)] = list(file_bytes_chunk)
        bytes_as_pixels2d = np.array(filled_array).reshape(self.dims[1], self.dims[0])
        # if len(file_bytes_chunk) >= self.dims_multiplied:
        #     self.original_bytes_arry.append(bytes_as_pixels2d.reshape(self.dims[1], self.dims[0]))
        return bytes_as_pixels2d
    
    def create_3d_frame_from_gray_frame(self, bytes_as_pixels2d):
        pixels_as_frame = np.dstack([bytes_as_pixels2d, bytes_as_pixels2d, bytes_as_pixels2d])
        return pixels_as_frame