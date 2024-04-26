import ffmpeg
import numpy as np


class VideoCapture:
    def __init__(self, video_stream_path, logging_stdout=False):
        self.path = video_stream_path
        self.video_stream = (
            ffmpeg.input(video_stream_path)
            .output('pipe:', format='rawvideo', pix_fmt='bgr24')
            .run_async(pipe_stdout=True)
        )

        self.video_props = self.__get_video_props(video_stream_path)
        self.frame_size_bytes = self.video_props["width"] * self.video_props[
            "height"] * 3  # H * W * 3 channels * 1-byte/channel

    def __get_video_props(self, video_stream_path):
        probe = ffmpeg.probe(video_stream_path)
        video_stream_details = next(
            (stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        width = int(video_stream_details['width'])
        height = int(video_stream_details['height'])
        probe = ffmpeg.probe(video_stream_path)
        video_stream_details = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        fps = int(video_stream_details['r_frame_rate'].split('/')[0])
        codec = video_stream_details['codec_name']
        return {"width": width, "height": height, "fps": fps, "codec": codec}

    def read(self):
        buffer = self.video_stream.stdout.read(self.frame_size_bytes)
        #  check buffer length is not W*H*3 (when FFmpeg streaming ends).
        ret = len(buffer) == self.frame_size_bytes
        width, height = self.video_props["width"], self.video_props[
            "height"]
        frame = np.frombuffer(buffer, np.uint8).reshape(height, width, 3)
        return ret, frame

    def get_video_props(self):
        return self.video_props

    def release(self):
        print("Closing video stream")
        # self.video_stream.stdout.close()
        print("Video stream closed")
        self.video_stream.wait()
        print("Video stream terminated")
