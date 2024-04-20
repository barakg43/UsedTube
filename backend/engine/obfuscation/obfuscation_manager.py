import cv2 
import logging
import uuid

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

        out_path =  str(uuid.uuid4()) + ".mp4"
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))

        while True:
            ret_ff, frame_ff = ff.read()
            if not ret_ff:
                self.logger.info("loop ended. No more frames in file_frames")
                break  

            out.write(frame_ff)  

            for _ in range(self.cycle):
                ret_cov, frame_cov = cov.read()
                if not ret_cov:
                    self.logger.info("No more frames in cover_video")
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

        obsv = cv2.VideoCapture(obfuscated_video_path)
        assert obsv.isOpened(), "Could not open obfuscated_video_path"

        fps = obsv.get(cv2.CAP_PROP_FPS)
        width = int(obsv.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(obsv.get(cv2.CAP_PROP_FRAME_HEIGHT))

        out_path = str(uuid.uuid4()) + ".mp4"  # Generate unique filename using UUID
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))

        while True:
            ret, frame = obsv.read()
            if not ret:
                self.logger.info("loop ended. No more frames to read")  
                break

            out.write(frame)  

            # Skip {cycle} frames
            for _ in range(self.cycle):
                ret, _ = obsv.read()
                if not ret:
                    self.logger.info("No more frames to skip")  
                    break

        # Release video capture and writer
        obsv.release()
        out.release()

        return out_path