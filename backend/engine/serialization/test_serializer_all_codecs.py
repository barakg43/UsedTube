import unittest

from engine.serialization.test_serializer import SerializerTest

codec_list = [

    # ['RGBA', 'avi'],  # too big
    # ['av01', 'mp4'], not working
    # ['vp09', 'mp4'],

    'mp4v',
    'avc1',
    'avc3',

    # ['drac', 'mp4'], # not working
    # 'hev1',# not working
    # 'hvc1', # not working
    # ['mhm1', 'mp4'], # not working
    # ['mlpa', 'mp4'], # not working
    # ['mp4s', 'mp4'], # not working
    'mp4v',
    # ['vc-1', 'mp4'],# not working
   'davc',
    'xvid',
]
# codec_list = [
# # 'dirac',
# 'mpegvideo',
# 'libvpx-vp9',
# 'vc1',
# 'jpeg2000',
# 'h264',
# 'vp9',
# 'tscc2',
# 'mpeg1video',
# 'mpeg2video',
# 'hevc',
# 'png',
# 'libdav1d',
# 'mjpeg',
# 'mpeg4',
# 'vp9'
#     ]


# Test class for running tests for each codec
for codec_pair in codec_list:
    codec = codec_pair
    file_ext = "mp4"
    test_method_name_Bit_Block = 'test_serializer_pdf_1B_1Block_{0}_{1}'.format(codec, file_ext)


    # Function to perform the test for a specific codec

    def test_bit_block(self, codec_arg=codec, file_ext_arg=file_ext):
        SerializerTest.perform_test_1Bit_Block(self, codec_arg, file_ext_arg)


    setattr(SerializerTest, test_method_name_Bit_Block, test_bit_block)
    # break
if __name__ == '__main__':
    unittest.main()
