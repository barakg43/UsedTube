from pathlib import Path
import unittest
from encryptor import Encryptor

RESOURCES_DIR = Path('../resources/')
OUTPUT_DIR = Path('../output_files/')


class EncryptorTest(unittest.TestCase):

    def test_encryptor_pdf_1B_1P(self):
        enc = Encryptor(Encryptor.PROTO_1B_TO_PIX)
        pdf_path = RESOURCES_DIR / "sample-file2.pdf"
        encryption_out_video_path = OUTPUT_DIR / f"output-video{enc.strategy.out_format}"
        cover_video_path = RESOURCES_DIR / "sample.mp4"
        decrypted_pdf_path = OUTPUT_DIR / "sample-file2-decrypted.pdf"

        pdf_file = open(pdf_path.as_posix(), 'rb')
        decrypted_pdf_file = open(decrypted_pdf_path.as_posix(), "wb")
        enc.encrypt(pdf_file, cover_video_path.as_posix(), encryption_out_video_path.as_posix())
        enc.decrypt(encryption_out_video_path.as_posix(), 64153731, decrypted_pdf_file)
        pdf_file.close()
        decrypted_pdf_file.close()

        original_file = open(pdf_path.as_posix(), 'rb')
        decrypted_file = open(decrypted_pdf_path.as_posix(), "rb")
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
