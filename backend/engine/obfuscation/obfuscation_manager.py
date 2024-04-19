import cv2 
import logging

class ObfuscationManager:

    def __init__(self, intermeshing_cycle: int=1):
        """
        Mix serialized frames with frames of a real video inorder to make
        the serialized videos hard to notice.
        first frame of uploaded videos are always of the serialized file.
        :param intermeshing_cycle: the amount of cover video frames between 2
        serialized frames.
        NOTE: 0th frame is always of the encrypted data
        """
        self.cycle = intermeshing_cycle
        self.logger = logging.Logger(__name__)
        self.logger.setLevel(logging.INFO)

    def obfuscate(self, file_frames_path: str, cover_video_path: str) -> str:
        # open 2 video as streams file_frames as ff, cover_video as cov
        # create new video container as out
        # do:
        #   read frame from ff
        #   write frame to out
        #   read {self.cycle} frames from cov
        #   write {self.cycle} frames to out
        #   while file_frames got frames
        # save out to a generated path, using UUID to avoid collisions?
        # return the path

        ff = cv2.VideoCapture(file_frames_path)
        assert ff.isOpened(), "Could not open file_frames_path"

        cov = cv2.VideoCapture(cover_video_path)
        assert cov.isOpened(), "Could not open cover_video_path"

        # Get video properties
        fps = ff.get(cv2.CAP_PROP_FPS)
        width = int(ff.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(ff.get(cv2.CAP_PROP_FRAME_HEIGHT))

        out_path = "output_video.mp4" 
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))

        frame_count = 0

        
        while True:
            ret_ff, frame_ff = ff.read()
            if not ret_ff:
                self.logger.info("loop ended. No more frames in file_frames")
                break  

            out.write(frame_ff)  
            frame_count += 1

            for _ in range(self.cycle):
                ret_cov, frame_cov = cov.read()
                if not ret_cov:
                    self.logger.info("loop ended. No more frames in cover_video")
                    break  

                out.write(frame_cov)  

        # Release video capture and writer
        ff.release()
        cov.release()
        out.release()

        return out_path


    def untangle(self, obfuscated_video_path:str ) -> str:
        # open the obfuscated_video as obsv
        # create a new out video container as out
        # do:
        #   read frame from obsv
        #   write that frame to out
        #   skip {self.cycle} frames from obsv
        #   while obsv got frames
        # save out to a generated path, using UUID to avoid collisions?
        # return the path
        pass