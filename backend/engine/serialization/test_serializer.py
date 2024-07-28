import csv
import os
import time
import unittest

import numpy as np

from engine.constants import TEST_RESOURCES_DIR, TEST_OUTPUT_DIR, SAMPLE_FILE_3, COVER_VIDEOS_DIR, \
    FILES_READY_FOR_STORAGE_DIR, SAMPLE_FILE_1
from engine.driver import Driver
from engine.serialization.serializer import Serializer
from engine.serialization.stateless_serializer import StatelessSerializer
from engine.serialization.strategy.impl.bit_to_block import BitToBlock
from engine.serialization.strategy.impl.three_bytes_to_two_pixels import ThreeBytesToTwoPixels
from engine.serialization.tests.driver_args import DriverArgs
from engine.serialization.tests.stateless_serializer_args import StatelessSerializerArgs

PDF_PATH = 0
ENC_OUT_VID_PATH = 1
COVER_VID_PATH = 2
DEC_PDF_PATH = 3

csv_path="C:\\ComputerScience\\Workshop\\UsedTube\\backend\\engine\\artifacts\\awaiting_storage\\out_1.csv"
file=open(csv_path, 'w', newline='')
csv_file = csv.writer(file, dialect='excel', delimiter=',')
csv_file.writerow(["codec", "encode_time", "decode_time","video_size"])
class SerializerTest(unittest.TestCase):

    def paths_dict(self):
        original_file_ext = "pdf"
        paths_dict = {PDF_PATH: (TEST_RESOURCES_DIR / SAMPLE_FILE_3).as_posix(),
                      ENC_OUT_VID_PATH: (
                              TEST_OUTPUT_DIR / "output-video_{fourcc}.{out_format}")
                      .as_posix(),
                      COVER_VID_PATH: (COVER_VIDEOS_DIR / "cover-video.mp4").as_posix(),
                      DEC_PDF_PATH: (
                              TEST_OUTPUT_DIR / "sample-file-decrypted_{fourcc}.pdf").as_posix()}

        return paths_dict

    def check_pdf_serialization(self, fourcc:str,out_format:str,block_size:int):

        driver = DriverArgs(fourcc,out_format,block_size)
        # self.enc = StatelessSerializer(proto, concurrent_execution=True)
        paths = self.paths_dict()
        video_encoded_path=paths[ENC_OUT_VID_PATH].format(fourcc=fourcc,out_format=out_format)
        begin_time = time.time()
        obfuscated_vid_path, zipped_file_size=driver.process_file_to_video(paths[PDF_PATH], "1")
        # obfuscated_vid_path, zipped_file_size=(
        #    (FILES_READY_FOR_STORAGE_DIR/"39d6440b-d37c-43bc-ab85-7bebfaed5307.mp4").as_posix(),
        #     12233262
        # )
        print( obfuscated_vid_path, zipped_file_size)
        # self.enc.serialize(paths[DEC_PDF_PATH], paths[COVER_VID_PATH], paths[ENC_OUT_VID_PATH])
        end_time = time.time()
        encode_time=end_time - begin_time
        print(f"Encoded In {encode_time}")
        file_size = os.stat(paths[PDF_PATH]).st_size
        begin_time = time.time()
        deserialized_pdf_path = driver.process_video_to_file(obfuscated_vid_path, zipped_file_size,"1",fourcc)
        # self.enc.deserialize(serialized_file_as_video_path=paths[ENC_OUT_VID_PATH],file_size= file_size, deserialized_pdf_file=paths[DEC_PDF_PATH])
        end_time = time.time()
        decode_time=end_time - begin_time
        print(f"Decoded In {decode_time}")
        print(deserialized_pdf_path)
        csv_file.writerow([fourcc, encode_time, decode_time,os.stat(obfuscated_vid_path).st_size])
        deserialized_pdf_file = open(deserialized_pdf_path, "rb")
        decrypted_sha256 = StatelessSerializerArgs.generateSha256ForFile(deserialized_pdf_file)
        pdf_file = open(paths[PDF_PATH], 'rb')
        original_sha256 = StatelessSerializerArgs.generateSha256ForFile(pdf_file)
        input_content = pdf_file.read()
        output_content = deserialized_pdf_file.read()
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
        deserialized_pdf_file.close()

        return original_sha256, decrypted_sha256

    def check_video_deserialization_after_downloading(self, proto, original_file_path, serialized_video_path):
        self.enc = Serializer(proto, concurrent_execution=True)
        paths = self.paths_dict()
        pdf_file = open(original_file_path, 'rb')
        decrypted_pdf_file = open(paths[DEC_PDF_PATH].format(""), "wb+")

        begin_time = time.time()
        file_size = os.stat(original_file_path).st_size
        self.enc.deserialize(serialized_video_path, file_size, paths[DEC_PDF_PATH])
        end_time = time.time()
        print(f"Decoded In {end_time - begin_time}")
        original_sha256 = self.enc.generateSha256ForFile(pdf_file)
        deserialized_sha256 = self.enc.generateSha256ForFile(decrypted_pdf_file)
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

        return original_sha256, deserialized_sha256

    def perform_test_1Bit_Block(self, codec, file_ext):
        # Replace this with your actual test implementation
        print(f"#### Bit to Block: Testing codec '{codec}' with file extension '.{file_ext}' ###")
        original_sha256, decrypted_sha256 = self.check_pdf_serialization(fourcc=codec, out_format=file_ext, block_size=4)
        self.assertEqual( original_sha256, decrypted_sha256)

    def perform_test_youtube_1B_1Block_decryption(self, codec, file_ext, encrypted_video_path, original_file_path):
        # Replace this with your actual test implementation
        print(f"#### Youtube: Testing codec '{codec}' with file extension '.{file_ext}' ###")
        sha256_1, sha256_2 = self.check_video_deserialization_after_downloading(
            BitToBlock(fourcc=codec, out_format=file_ext, block_size=4), original_file_path, encrypted_video_path)
        self.assertEqual(sha256_1, sha256_2)

    # def test_encryptor_pdf_1B_1P(self):
    #     self.check_pdf_encryption(PROTO_1B_1P)

    # def test_encryptor_pdf_3B_2P(self):
    #     self.assertEqual(*self.check_pdf_encryption(ThreeBytesToTwoPixels(fourcc="RGBA", out_format="avi")))
