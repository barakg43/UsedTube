import av

from engine.constants import DEFAULT_BITRATE

kbps = 1024


class VideoWriter:
    def __init__(self, out_video_path, fourcc: str, fps: int, frame_size: (int, int),
                 bitrate: int | None = DEFAULT_BITRATE):
        self.output_video = av.open(out_video_path, mode='w')
        self.video_stream = self.output_video.add_stream(fourcc, rate=fps)
        self.video_stream.width = frame_size[0]
        self.video_stream.height = frame_size[1]
        if bitrate:
            self.video_stream.bit_rate = bitrate * kbps

    def write(self, frame):
        frame_av = av.VideoFrame.from_ndarray(frame, format='bgr24')
        out_packet = self.video_stream.encode(frame_av)  # Encode video frame
        self.output_video.mux(out_packet)

    def frame_count(self):
        return self.output_video.streams.video[0].frames

    def release(self):
        self.output_video.mux(self.video_stream.encode(None))

        # Close the file
        self.output_video.close()
