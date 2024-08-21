import av
import numpy as np
from av.video.stream import VideoStream
import imageio

class VideoCapture:
    def __init__(self, video_stream_path:str):
        self.error_massage = None
        self.video_input = None
        try:
            self.video_input = av.open(video_stream_path)
        except Exception as e:
            self.error_massage = str(e)
            return
        self.path = video_stream_path
        self.frame_counter=0
        self.video_stream: VideoStream = self.video_input.streams.video[0]
        self.frames_generator = self.video_input.decode(video=0)
        self.video_props = self.__get_video_props()
        # self.frame_size_bytes = self.video_props["width"] * self.video_props[
        #     "height"] * 3  # H * W * 3 channels * 1-byte/channel

    def __get_video_props(self):
        self.__check_if_open()
        # probe = ffmpeg.probe(video_stream_path)
        # video_stream_details = next(
        #     (stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        width = self.video_stream.width
        height = self.video_stream.height
        # video_stream_details = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
        fps = int(self.video_stream.average_rate)
        codec = self.video_stream.codec_context.name
        frames_count = self.video_stream.frames

        return {"width": width, "height": height, "fps": fps, "codec": codec,"frames_count":frames_count}

    def read(self):
        self.__check_if_open()
        frame_cv = next(self.frames_generator, None)
        isValid: bool = frame_cv is not None
        if not isValid and self.frame_counter==0:
            raise BrokenPipeError("Empty frame stream")
        if isValid:
            frame = frame_cv.to_ndarray(format="bgr24")
            self.frame_counter += 1
            return isValid, frame
        else:
            return isValid, None

    # buffer = self.video_stream.stdout.read(self.frame_size_bytes)
    # #  check buffer length is not W*H*3 (when FFmpeg streaming ends).
    # ret = len(buffer) == self.frame_size_bytes
    # width, height = self.video_props["width"], self.video_props[
    #     "height"]
    # frame = np.frombuffer(buffer, np.uint8).reshape(height, width, 3)
    def get_video_props(self):
        self.__check_if_open()

        return self.video_props

    def set(self, offset: int):
        self.__check_if_open()

        self.video_input.seek(offset)

    def isOpened(self):
        return self.error_massage is None

    def __check_if_open(self):
        if not self.isOpened():
            raise FileNotFoundError(self.error_massage)

    def release(self):
        self.__check_if_open()

        self.video_input.close()
