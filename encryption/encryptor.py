import cv2
import numpy as np

import os
class Encryptor:
    def encrypt(self, file_path, video_path):
        """"
        :parameter file_path receives a file to encrypt
        :parameter video_path a video to intertwine the encrypted file with
        :returns encrypted video, metadata
        """
        cover_video = cv2.VideoCapture(video_path)
        # W,H
        DIMS, ENCODING, FPS = self.get_cover_video_metadata(cover_video)
        with open(file_path, 'rb') as file_to_encrypt:
            output_video = cv2.VideoWriter("output.mp4", ENCODING, FPS, DIMS)
            # create a frame based on the file's binary
            file_bytes = file_to_encrypt.read(DIMS[0] * DIMS[1])
            bytes_as_pixels = list(file_bytes)
            bytes_as_pixels = list(map(lambda byte: (byte, byte, byte), bytes_as_pixels))



    def get_cover_video_metadata(self, cover_video):
        DIMS = (int(cover_video.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cover_video.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        FPS = cover_video.get(cv2.CAP_PROP_FPS)
        ENCODING = cv2.VideoWriter.fourcc(*'XVID')
        return DIMS, ENCODING, FPS

    def decrypt(self, metadata):
        pass


enc = Encryptor()
enc.encrypt("C:\\Users\\Admin\\Desktop\\CV Submissions\\Gal Aviezri - CV.pdf", '../resources/sample.mp4')
