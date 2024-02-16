import cv2
import numpy as np
import os
import os


class Encryptor:

    def __init__(self):
        self.file_size = 64153731  # for testing purpose

    def encrypt(self, file_path, video_path):
        """"
        :parameter file_path receives a file to encrypt
        :parameter video_path a video to intertwine the encrypted file with
        :returns encrypted video, metadata
        """
        cover_video = cv2.VideoCapture(video_path)
        # W,H
        DIMS, ENCODING, FPS = self.get_cover_video_metadata(cover_video)

        # get bytes amount in the file
        self.file_size = os.path.getsize(file_path)
        print(self.file_size)
        frame_amount_in_cover = int(cover_video.get(cv2.CAP_PROP_FRAME_COUNT))
        bytes_amount_in_frame = DIMS[0] * DIMS[1]
        with open(file_path, 'rb') as file_to_encrypt:
            output_video = cv2.VideoWriter("../resources/output.mp4", ENCODING, FPS, DIMS)
            file_bytes_chunk = self.read_binary_chunk_from_file(bytes_amount_in_frame, file_to_encrypt)
            while (cover_video.isOpened() and file_bytes_chunk):
                is_success_read_video_frame = self.add_cover_video_frames_to_output_before_file_frame(cover_video,
                                                                                                      output_video, 24)
                if not is_success_read_video_frame:
                    break
                if (file_bytes_chunk):
                    bytes_as_pixels2d = self.create_2d_image_frame_grayscale(DIMS, file_bytes_chunk)
                    pixels_as_frame = self.create_3d_frame_from_gray_image(bytes_as_pixels2d)
                    output_video.write(pixels_as_frame)
                    file_bytes_chunk = self.read_binary_chunk_from_file(bytes_amount_in_frame, file_to_encrypt)
            # Closes all the video sources
            cover_video.release()
            output_video.release()
            cv2.destroyAllWindows()

    def create_3d_frame_from_gray_image(self, bytes_as_pixels2d):
        pixels_as_frame = np.dstack([bytes_as_pixels2d, bytes_as_pixels2d, bytes_as_pixels2d])
        return pixels_as_frame

    def create_2d_image_frame_grayscale(self, DIMS, file_bytes_chunk):
        filled_array = np.zeros(DIMS[1] * DIMS[0])
        filled_array[:len(file_bytes_chunk)] = list(file_bytes_chunk)
        bytes_as_pixels2d = np.array(filled_array).reshape(DIMS[1], DIMS[0])
        return bytes_as_pixels2d

    def read_binary_chunk_from_file(self, max_bytes_to_read, file_to_encrypt):
        file_bytes_chunk = file_to_encrypt.read(max_bytes_to_read)
        return file_bytes_chunk

    def add_cover_video_frames_to_output_before_file_frame(self, cover_video, output_video, frame_amount):
        for i in range(frame_amount):
            ret, frame = cover_video.read()
            if not ret:  # can't read more video frame to output video
                break
            output_video.write(frame)
        return ret

    def get_cover_video_metadata(self, cover_video):
        DIMS = (int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        FPS = cover_video.get(cv2.CAP_PROP_FPS)
        ENCODING = cv2.VideoWriter.fourcc(*'mp4v')
        return DIMS, ENCODING, FPS

    def decrypt(self, metadata):
        cover_video = cv2.VideoCapture(metadata)
        DIMS, ENCODING, FPS = self.get_cover_video_metadata(cover_video)
        frame_size = DIMS[1] * DIMS[0]
        file_as_binary_array = np.empty(0)
        remain_file_bytes_to_read = self.file_size
        while cover_video.isOpened():
            ret, encrypt_frame = cover_video.read()
            if not ret:
                break
            bytes_amount_to_read = frame_size if remain_file_bytes_to_read > frame_size else remain_file_bytes_to_read
            remain_file_bytes_to_read -= bytes_amount_to_read
            file_bytes_chunk = self.create_file_binary_chunk_from_video_frame(frame_size, bytes_amount_to_read,
                                                                              encrypt_frame)
            file_as_binary_array = np.concatenate((file_as_binary_array, file_bytes_chunk))
        # write the bytes array to file
        decrypt_file = open("../resources/sample_decrypt.pdf", "wb")
        decrypt_file.write(file_as_binary_array.tobytes())
        # Closes all the video sources
        cover_video.release()
        cv2.destroyAllWindows()

    def create_file_binary_chunk_from_video_frame(self, frame_size, bytes_amount_to_read, encrypt_frame):
        bytes_as_pixels2d_list3 = np.split(encrypt_frame, 3, axis=2)
        flatten_pixel_array = bytes_as_pixels2d_list3[0].reshape(frame_size)[:bytes_amount_to_read]
        return flatten_pixel_array


enc = Encryptor()
enc.encrypt("../resources/sample-file2.pdf", '../resources/sample.mp4')
enc.decrypt("../resources/output.mp4")
