import time
from pathlib import Path
import unittest
from encryption.encryptor import Encryptor
from encryption.strategy.impl.one_byte_to_one_pixel import PROTO_1B_1P
from encryption.strategy.impl.three_bytes_to_two_pixels import PROTO_3B_TO_2PIX

RESOURCES_DIR = Path('../resources/')
OUTPUT_DIR = Path('../output_files/')
PDF_PATH = 0
ENC_OUT_VID_PATH = 1
COVER_VID_PATH = 2
DEC_PDF_PATH = 3


class EncryptorTest(unittest.TestCase):

    def paths_dict(self):
        paths_dict = {PDF_PATH: (RESOURCES_DIR / "sample-file2.pdf").as_posix(),
                      ENC_OUT_VID_PATH: (OUTPUT_DIR / f"output-video{self.enc.strategy.out_format}").as_posix(),
                      COVER_VID_PATH: (RESOURCES_DIR / "sample.mp4").as_posix(),
                      DEC_PDF_PATH: (OUTPUT_DIR / "sample-file2-decrypted.pdf").as_posix()}

        return paths_dict

    def test_pdf_encryption(self, proto):
        self.enc = Encryptor(proto)
        paths = self.paths_dict()
        pdf_file = open(paths[PDF_PATH], 'rb')

        decrypted_pdf_file = open(paths[DEC_PDF_PATH], "wb+")
        begin_time = time.time()
        self.enc.encrypt(pdf_file, paths[COVER_VID_PATH], paths[ENC_OUT_VID_PATH])
        end_time = time.time()
        print(f"Encoded In {end_time - begin_time}")
        begin_time = time.time()
        self.enc.decrypt(paths[ENC_OUT_VID_PATH], 64153731, decrypted_pdf_file)
        end_time = time.time()
        print(f"Decoded In {end_time - begin_time}")
        original_sha256 = self.enc.generateSha256ForFile(pdf_file)
        decrypted_sha256 = self.enc.generateSha256ForFile(decrypted_pdf_file)
        pdf_file.close()
        decrypted_pdf_file.close()
        original_file = open(paths[PDF_PATH], 'rb')
        decrypted_file = open(paths[DEC_PDF_PATH], "rb")
        input_content = original_file.read()
        output_content = decrypted_file.read()
        original_file.close()
        decrypted_file.close()
        res = True
        bytes_asserted = 0
        for (byte1, byte2) in zip(input_content, output_content):
            res = byte1 == byte2
            bytes_asserted += 1
        print(f"bytes asserted: {bytes_asserted}")
        self.assertEqual(res, True)
        self.assertEqual(original_sha256,decrypted_sha256)
    def test_encryptor_pdf_1B_1P(self):
        self.test_pdf_encryption(PROTO_1B_1P)

    def test_encryptor_pdf_3B_2P(self):
        self.test_pdf_encryption(PROTO_3B_TO_2PIX)
