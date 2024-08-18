import unittest

from engine.serialization.test_serializer import SerializerTest

codec_list = [
    # "av1",
    "h264_mf",
    # "h264",
    # "hevc",
    # "jpeg2000",
    # "libopenjpeg",
    # "libvpx-vp9",
    # "libx264",
    # "libx265",
    # "mpeg1video",
    # "mpeg2video",
    # "mpeg4",
    # "vp9",
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
    for block_size in range(4, 20,2):
        test_method_name_Bit_Block = 'test_serializer_pdf_1B_1Block_{0}_{1}_Block:{2}'.format(codec, file_ext, block_size)
        # Function to perform the test for a specific codec
        def test_bit_block(self, codec_arg=codec, file_ext_arg=file_ext, block_size_arg=20):
            SerializerTest.perform_test_1Bit_Block(self, codec_arg, file_ext_arg, block_size_arg)
        setattr(SerializerTest, test_method_name_Bit_Block, test_bit_block)



    # break
if __name__ == '__main__':
    unittest.main()
