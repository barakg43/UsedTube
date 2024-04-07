import os
import time
import unittest
from pathlib import Path

import numpy as np

from encryption.encryptor import Encryptor
from encryption.strategy.impl.bit_to_block import BitToBlock
from encryption.strategy.impl.three_bytes_to_two_pixels import ThreeBytesToTwoPixels

RESOURCES_DIR = Path('../resources/')
OUTPUT_DIR = Path('../output_files/')
if not os.path.exists(OUTPUT_DIR):
    os.mkdir(OUTPUT_DIR)
PDF_PATH = 0
ENC_OUT_VID_PATH = 1
COVER_VID_PATH = 2
DEC_PDF_PATH = 3


class EncryptorTest(unittest.TestCase):

    def paths_dict(self):
        original_file_ext = "pdf"
        paths_dict = {PDF_PATH: (RESOURCES_DIR / f"sample-file.{original_file_ext}").as_posix(),
                      ENC_OUT_VID_PATH: (
                              OUTPUT_DIR / f"output-video_{self.enc.strategy.fourcc}.{self.enc.strategy.out_format}")
                      .as_posix(),
                      COVER_VID_PATH: (RESOURCES_DIR / "sample.mp4").as_posix(),
                      DEC_PDF_PATH: (
                              OUTPUT_DIR / f"sample-file-decrypted_{self.enc.strategy.fourcc}.{original_file_ext}").as_posix()}

        return paths_dict

    def check_pdf_encryption(self, proto):
        self.enc = Encryptor(proto)
        paths = self.paths_dict()
        pdf_file = open(paths[PDF_PATH], 'rb')
        decrypted_pdf_file = open(paths[DEC_PDF_PATH], "wb+")
        begin_time = time.time()

        self.enc.encrypt(pdf_file, paths[COVER_VID_PATH], paths[ENC_OUT_VID_PATH])
        end_time = time.time()
        print(f"Encoded In {end_time - begin_time}")
        begin_time = time.time()
        file_size = os.stat(paths[PDF_PATH]).st_size
        self.enc.decrypt(paths[ENC_OUT_VID_PATH], file_size, decrypted_pdf_file)
        end_time = time.time()
        print(f"Decoded In {end_time - begin_time}")
        original_sha256 = self.enc.generateSha256ForFile(pdf_file)
        decrypted_sha256 = self.enc.generateSha256ForFile(decrypted_pdf_file)
        input_content = pdf_file.read()
        output_content = decrypted_pdf_file.read()
        res = True
        bytes_asserted = 0
        for (byte1, byte2) in zip(input_content, output_content):
            if byte1 != byte2:
                bytes_asserted += 1
                if (bytes_asserted < 9):
                    print(f"input: {np.binary_repr(byte1, width=8)}, output: {np.binary_repr(byte2, width=8)}")
                    # break
        if bytes_asserted > 0:
            print(f"bytes asserted: {bytes_asserted}")

        pdf_file.close()
        decrypted_pdf_file.close()

        return original_sha256, decrypted_sha256

    def __perform_test_3P_2B(self, codec, file_ext):
        # Replace this with your actual test implementation
        print(f"#### 3P_2B: Testing codec '{codec}' with file extension '.{file_ext}' ###")
        sha256_1, sha256_2 = self.check_pdf_encryption(ThreeBytesToTwoPixels(fourcc=codec, out_format=file_ext))
        self.assertEqual(sha256_1, sha256_2)

    def perform_test_1Bit_Block(self, codec, file_ext):
        # Replace this with your actual test implementation
        print(f"#### Bit to Block: Testing codec '{codec}' with file extension '.{file_ext}' ###")
        sha256_1, sha256_2 = self.check_pdf_encryption(BitToBlock(fourcc=codec, out_format=file_ext, block_size=1))
        self.assertEqual(sha256_1, sha256_2)

    # def test_encryptor_pdf_1B_1P(self):
    #     self.check_pdf_encryption(PROTO_1B_1P)

    # def test_encryptor_pdf_3B_2P(self):
    #     self.assertEqual(*self.check_pdf_encryption(ThreeBytesToTwoPixels(fourcc="RGBA", out_format="avi")))
