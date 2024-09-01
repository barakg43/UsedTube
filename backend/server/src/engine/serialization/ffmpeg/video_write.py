import av

from engine.constants import DEFAULT_BITRATE

# import av
#
#
# duration = 4
# fps = 24
# total_frames = duration * fps
#
# container = av.open("test.mp4", mode="w")
#
# stream = container.add_stream("mpeg4", rate=fps)
# stream.width = 480
# stream.height = 320
# stream.pix_fmt = "yuv420p"
#
# for frame_i in range(total_frames):
#
#     img = np.empty((480, 320, 3))
#     img[:, :, 0] = 0.5 + 0.5 * np.sin(2 * np.pi * (0 / 3 + frame_i / total_frames))
#     img[:, :, 1] = 0.5 + 0.5 * np.sin(2 * np.pi * (1 / 3 + frame_i / total_frames))
#     img[:, :, 2] = 0.5 + 0.5 * np.sin(2 * np.pi * (2 / 3 + frame_i / total_frames))
#
#     img = np.round(255 * img).astype(np.uint8)
#     img = np.clip(img, 0, 255)
#
#     frame = av.VideoFrame.from_ndarray(img, format="rgb24")
#     for packet in stream.encode(frame):
#         container.mux(packet)

# # Flush stream
# for packet in stream.encode():
#     container.mux(packet)
#
# # Close the file
# container.close()

kbps = 1024


class VideoWriter:
    def __init__(self, out_video_path, fourcc: str, fps: int, frame_size: (int, int), bitrate: int | None = DEFAULT_BITRATE):
        self.output_video = av.open(out_video_path, mode='w')
        self.video_stream = self.output_video.add_stream(fourcc, rate=fps)
        self.video_stream.width = frame_size[0]
        self.video_stream.height = frame_size[1]
        # print(f"{fourcc} result codec:",self.video_stream.codec_context.name)
        if bitrate:
            self.video_stream.bit_rate = bitrate * kbps

        # self.path = out_video_path
        # self.output_video = (
        #     ffmpeg.input(filename='pipe:', format='rawvideo', pix_fmt='bgr24',
        #                  s='{}x{}'.format(frame_size[0], frame_size[1]))
        #     .output(out_video_path, r=f'{fps}', vtag=fourcc)
        #     .overwrite_output()
        #     .run_async(pipe_stdin=True, quiet=not logging_stdout)
        # )

    def write(self, frame):

        frame_av = av.VideoFrame.from_ndarray(frame, format='bgr24')
        # packet = self.video_stream.encode(frame_av)
        out_packet = self.video_stream.encode(frame_av)  # Encode video frame
        self.output_video.mux(out_packet)
    # for packet in self.video_stream.encode(frame_av):
    #         self.output_video.mux(packet)

    def frame_count(self):
        return self.output_video.streams.video[0].frames

    def release(self):
        self.output_video.mux(self.video_stream.encode(None))

        # Close the file
        self.output_video.close()
