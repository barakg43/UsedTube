import unittest

from encryption.test_encryptor_copy import EncryptorTest

codec_arry = [
    ['RGBA', 'avi'],  # too big
    # ['av01', 'mp4'], bad codec
    ['avc1', 'mp4'],
    ['avc3', 'mp4'],
    ['drac', 'mp4'],
    ['hev1', 'mp4'],
    ['hvc1', 'mp4'],
    ['mhm1', 'mp4'],
    ['mlpa', 'mp4'],
    ['mp4s', 'mp4'],
    ['mp4v', 'mp4'],
    ['mp4v', 'mp4'],
    ['vc-1', 'mp4'],
    ['vp09', 'mp4'],
    ['xvid', 'mp4']
]

# Test class for running tests for each codec
for codec_pair in codec_arry:
    codec = codec_pair[0]
    file_ext = codec_pair[1]
    test_method_name_3P_2B = 'test_encryptor_pdf_3B_2P_{0}_{1}'.format(codec, file_ext)
    test_method_name_Bit_Block = 'test_encryptor_pdf_1B_1Block_{0}_{1}'.format(codec, file_ext)


    # Function to perform the test for a specific codec
    def test_3p_2B(self, codec_arg=codec, file_ext_arg=file_ext):
        EncryptorTest.perform_test_3P_2B(self, codec_arg, file_ext_arg)


    def test_bit_block(self, codec_arg=codec, file_ext_arg=file_ext):
        EncryptorTest.perform_test_1Bit_Block(self, codec_arg, file_ext_arg)


    # setattr(EncryptorTest, test_method_name_3P_2B, test_3p_2B)
    setattr(EncryptorTest, test_method_name_Bit_Block, test_bit_block)
    break
if __name__ == '__main__':
    unittest.main()
