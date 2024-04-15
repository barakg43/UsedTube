import unittest

from Backend.engine.serialization.test_serializer import SerializerTest, OUTPUT_DIR, RESOURCES_DIR

file_arry = [

    # ['RGBA', 'avi'],  # too big
    # ['av01', 'mp4'], not working
    ['vp09', 'mkv'],
    ['mp4v', 'mkv'],
    ['avc1', 'mkv'],
    ['avc3', 'mkv'],
    # ['drac', 'mp4'], # not working
    ['hev1', 'mkv'],
    # ['hvc1', 'mp4'], # not working
    # ['mhm1', 'mp4'], # not working
    # ['mlpa', 'mp4'], # not working
    # ['mp4s', 'mp4'], # not working
    ['mp4v', 'mkv'],
    # ['vc-1', 'mkv'], not tested on YouTube
    ['davc', 'mkv'],
    ['xvid', 'mkv']
]

# Test class for running tests for each codec
for file in file_arry:
    codec = file[0]
    file_ext = file[1]
    video_path = ((
                          OUTPUT_DIR / "result-youtube" / f"output video {codec} (2160p_25fps_VP9 LQ-128kbit_AAC).{file_ext}")
                  .as_posix())
    test_method_name_Bit_Block = 'test_decryption_YouTube_1B_1Block_{0}_{1}'.format(codec, file_ext)
    file_path = (RESOURCES_DIR / "sample-file2.pdf").as_posix()


    # Function to perform the test for a specific codec
    def test_youtube_1b_1block_decryption(self, codec_arg=codec, file_ext_arg=file_ext,
                                          encrypted_video_path=video_path, original_file_path=file_path):
        SerializerTest.perform_test_youtube_1B_1Block_decryption(self, codec_arg, file_ext_arg, encrypted_video_path,
                                                                 original_file_path)


    setattr(SerializerTest, test_method_name_Bit_Block, test_youtube_1b_1block_decryption)
    # break
if __name__ == '__main__':
    unittest.main()
