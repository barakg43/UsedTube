import os, numpy
import unittest
from encryptor import Encryptor


class EncryptorTest(unittest.TestCase):
    def test_encryptor_pdf(self):
        print(os.getcwd())
        enc = Encryptor(Encryptor.PROTO_1B_TO_PIX)
        file_to_encrypt = "sample-file2.pdf"
        output_video_name = "../output_files/outvid"
        
        in_file = open("../resources/" + file_to_encrypt, 'rb')
        out_file = open("../output_files/out.pdf", "wb")
        enc.encrypt(in_file, '../resources/sample.mp4', "encryped_out_vid.avi")
        enc.decrypt(output_video_name, 64153731, out_file)
        out_file.close()
        in_file.close()
        
        in_file = open("../resources/" + file_to_encrypt, 'rb')
        out_file = open("../output_files/out.pdf", "rb")
        input_content = in_file.read()
        output_content = out_file.read()
        in_file.close()
        out_file.close()
        
        res = True
        
        for bytes in zip(input_content, output_content):
            res = bytes[0] == bytes[1]
        self.assertEqual(res, True)
        