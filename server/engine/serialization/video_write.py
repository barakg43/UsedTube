import ffmpeg


class VideoWriter:
    def __init__(self, out_video_path, fourcc: str, fps: int, frame_size: (int, int), logging_stdout=False):
        self.path = out_video_path
        kbps = 1024
        self.output_video = (
            ffmpeg.input(filename='pipe:', format='rawvideo', pix_fmt='bgr24',
                         s='{}x{}'.format(frame_size[0], frame_size[1]))
            .output(out_video_path, r=f'{fps}', vtag=fourcc, video_bitrate=8000 * kbps)
            .overwrite_output()
            .run_async(pipe_stdin=True)
        )

    def write(self, frame):
        self.output_video.stdin.write(frame.tobytes())

    def release(self):
        self.output_video.stdin.close()
        # self.output_video.stdout.close()
        self.output_video.wait()
