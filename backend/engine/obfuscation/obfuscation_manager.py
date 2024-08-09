import logging
import uuid
from typing import Callable

import cv2

from engine.constants import FILES_READY_FOR_STORAGE_DIR, GENERAL_LOGGER, TMP_WORK_DIR, MINIMUM_VIDEO_FRAME_AMOUNT


class ObfuscationManager:

    def __init__(self, intermeshing_cycle: int = 5):
        """
        Mix serialized frames with frames of a real video inorder to make
        the serialized videos hard to notice.
        first frame of uploaded videos are always of the serialized file.
        :param intermeshing_cycle: the amount of cover video frames between 2
        serialized frames.
        NOTE: 0th frame is always of the encrypted data
        """
        self.cycle = intermeshing_cycle
        self.logger = logging.Logger(GENERAL_LOGGER)
        self.logger.setLevel(logging.DEBUG)

    def obfuscate(self, file_frames_path: str, cover_video_path: str, fourcc: int,
                  progress_tracker: Callable[[float], None] = None) -> str:
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

        file_frames_video = cv2.VideoCapture(file_frames_path)
        assert file_frames_video.isOpened(), f"Could not open {file_frames_path}"

        cover_video = cv2.VideoCapture(cover_video_path)
        assert cover_video.isOpened(), f"Could not open {cover_video_path}"

        # Get video properties
        fps = file_frames_video.get(cv2.CAP_PROP_FPS)
        width = int(file_frames_video.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(file_frames_video.get(cv2.CAP_PROP_FRAME_HEIGHT))

        out_path = (FILES_READY_FOR_STORAGE_DIR / f"{uuid.uuid4()}.mp4").as_posix()
        fourcc = cv2.VideoWriter.fourcc(*fourcc)
        out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))
        frame_counter = [0]  # make it mutable for the progress tracker

        file_frames_amount = int(file_frames_video.get(cv2.CAP_PROP_FRAME_COUNT))
        output_frames_amount = file_frames_amount * (self.cycle + 1)
        output_frames_amount_with_min_length = max(MINIMUM_VIDEO_FRAME_AMOUNT, output_frames_amount)

        def update_progress():
            # print(f"obfuscation progress:{frame_counter[0]}/{output_frames_amount_with_min_length}%")
            if progress_tracker is not None:
                progress_tracker(frame_counter[0] / output_frames_amount_with_min_length)

        while True:
            ret_ff, frame_ff = file_frames_video.read()
            if not ret_ff:
                self.logger.info("loop ended. No more frames in file_frames")
                break

            out.write(frame_ff)
            frame_counter[0] += 1
            update_progress()
            self.__write_frames_from_cover_to_output_video(out, cover_video, self.cycle, frame_counter, update_progress)

            self.logger.info("obfuscated frame wrote: " + str(frame_counter[0]))
        if frame_counter[
            0] < MINIMUM_VIDEO_FRAME_AMOUNT:  #make the output video at least 'MINIMUM_VIDEO_FRAME_AMOUNT' frames
            self.__write_frames_from_cover_to_output_video(out, cover_video,
                                                           MINIMUM_VIDEO_FRAME_AMOUNT - frame_counter[0], frame_counter,
                                                           update_progress)

        frame_count = int(out.get(cv2.CAP_PROP_FRAME_COUNT))
        self.logger.info(f"loop ended with frame_counter: {frame_counter[0]}/{output_frames_amount_with_min_length}")
        # Release video capture and writer
        file_frames_video.release()
        cover_video.release()
        out.release()

        return out_path

    def __write_frames_from_cover_to_output_video(self, obfuscated_video_out: cv2.VideoWriter,
                                                  cover_video: cv2.VideoCapture,
                                                  frame_amount: int,
                                                  frame_counter: list[int],
                                                  update_progress: Callable[[], None]):
        for _ in range(frame_amount):
            ret_cov, frame_cov = cover_video.read()
            if not ret_cov:
                self.logger.info("No more frames in cover_video")
                break
            obfuscated_video_out.write(frame_cov)
            frame_counter[0] += 1
            update_progress()

    def untangle(self, obfuscated_video_path: str, progress_tracker: Callable[[float], None] = None) -> str:
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

        out_path = (TMP_WORK_DIR / f"{uuid.uuid4()}.mp4").as_posix()  # Generate unique filename using UUID
        fourcc = cv2.VideoWriter.fourcc(*'mp4v')
        out = cv2.VideoWriter(out_path, fourcc, fps, (width, height))
        frame_counter = 0
        frame_amount = int(obsv.get(cv2.CAP_PROP_FRAME_COUNT))
        while True:
            ret, frame = obsv.read()
            if not ret:
                break

            out.write(frame)
            frame_counter += 1
            progress_tracker(frame_counter / frame_amount)
            # Skip {cycle} frames
            for _ in range(self.cycle):
                _ = obsv.read()
                frame_counter += 1
                progress_tracker(frame_counter / frame_amount)

        # Release video capture and writer
        obsv.release()
        out.release()

        return out_path
