import logging
import os
from typing import Callable

import dailymotion
import nest_asyncio

from engine.constants import UPLOAD_VIDEO_CHUNK_SIZE, SERIALIZE_LOGGER
from engine.uploader.definition import Uploader

nest_asyncio.apply()


class DailymotionUploader(Uploader):
    base_url = "ABCDE"

    def __init__(self, logger_name: str = SERIALIZE_LOGGER):
        super().__init__()

        # Load .env.local file temporarily from here-only for testing...
        self.logger = logging.getLogger(logger_name)
        self.base_url_api = "https://partner.api.dailymotion.com/rest/"
        self.auth_url = "https://partner.api.dailymotion.com/oauth/v1/token"
        self.videos_url_template = "https://www.dailymotion.com/video/{}"

        self.authorization_header = None

    def upload(self, file_path: str, api_keys: dict, progress_tracker: Callable[[float], None] = None) -> str:
        client = dailymotion.Dailymotion()
        client.set_grant_type('password',
                              api_key=api_keys["key"],
                              api_secret=api_keys["secret"],
                              scope=['manage_videos'], info={
                "username": api_keys["username"],
                "password": api_keys["password"]})
        upload_url = self.__upload_video(client, file_path, progress_tracker)
        publish_url = self.__publish_uploaded_video(client, upload_url)
        return publish_url

    # Sending the video file to the upload url obtained in the previous function
    def __upload_video(self, client, file_path, tracker: Callable[[float], None]):

        video_size = os.stat(file_path).st_size
        chunk_amount = video_size / UPLOAD_VIDEO_CHUNK_SIZE

        def progress_tracker(bytes_written, total_size):
            percent = bytes_written / total_size
            self.logger.info(f"{file_path}:Dailymotion Uploaded {percent * 100:.2f}%")
            if tracker is not None:
                tracker(percent)

        try:
            upload_url = client.upload(file_path, workers=chunk_amount, progress=progress_tracker)
            return upload_url
        except Exception as e:
            self.logger.error(e, exc_info=True)
            raise e

    def __publish_uploaded_video(self, client, uploaded_url):
        '''
        Now that your video has been uploaded, you can publish it to make it visible
        '''

        pub_url = client.post(
            "/me/videos",
            {
                "url": uploaded_url,
                "title": "MyTitle",
                "published": "true",
                "channel": "creation",
                "is_created_for_kids": "false",
            })
        return self.videos_url_template.format(pub_url['id'])

    def __get_percent_progress(self, current, total):
        """
        Example of function which prints the percentage of progression
        :param current: current bytes sent
        :param total: total bytes
        :return: percent number
        """
        percent = round((min((current * 100) / total, 100)), 2)
        return percent


Mr_DailymotionUploader = DailymotionUploader()
