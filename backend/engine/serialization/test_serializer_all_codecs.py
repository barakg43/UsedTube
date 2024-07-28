import unittest

from engine.serialization.test_serializer import SerializerTest

# codec_arry = [
#
#     # ['RGBA', 'avi'],  # too big
#     # ['av01', 'mp4'], not working
#     # ['vp09', 'mp4'],
#
#     # ['mp4v', 'mp4'],
#     # ['avc1', 'mp4'],
#     # ['avc3', 'mp4'],
#
#     # ['drac', 'mp4'], # not working
#     ['hev1', 'mp4'],# not working
#     ['hvc1', 'mp4'], # not working
#     # ['mhm1', 'mp4'], # not working
#     # ['mlpa', 'mp4'], # not working
#     # ['mp4s', 'mp4'], # not working
#     ['mp4v', 'mp4'],
#     # ['vc-1', 'mp4'],# not working
#     ['davc', 'mp4'],
#     ['xvid', 'mp4']
# ]
codec_list = [
    # 'aac',
    # 'aac_fixed',
    # 'ac3',
    # 'ac3_fixed',
    # 'alac',
    # 'als',
    # 'av1',
    # 'dca',
    # 'dirac',
    # 'dvdsub',
    # 'eac3',
    # 'evrc',
    # 'flac',
    'h264',
    # 'h264_mf',
    'hevc',
    # 'hevc_mf',
    'jpeg2000',
    'libaom-av1',
    'libdav1d',
    # 'libmp3lame',
    # 'libopenjpeg',
    'libopus',
    # 'libtwolame',
    'libvorbis',
    'libvpx-vp9',
    # 'libx264',
    # 'libx264rgb',
    # 'libx265',
    'mjpeg',
    'mov_text',
    'mp2',
    # 'mp2fixed',
    'mp2float',
    'mp3',
    # 'mp3_mf',
    'mp3float',
    'mpeg1video',
    'mpeg2video',
    'mpeg4',
    'mpegvideo',
    'opus',
    'pcm_f32be',
    'pcm_f32le',
    'pcm_f64be',
    'pcm_f64le',
    'pcm_s16be',
    'pcm_s16le',
    'pcm_s24be',
    'pcm_s24le',
    'pcm_s32be',
    'pcm_s32le',
    'png',
    'qcelp',
    'truehd',
    'tscc2',
    # 'ttml',
    'vc1',
    # 'vc2',
    'vorbis',
    'vp9']

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
