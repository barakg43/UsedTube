import logging
import os
from os import getenv, path
from typing import Callable

import dailymotion
import dotenv

from django_server.settings import BASE_DIR
from engine.constants import UPLOAD_VIDEO_CHUNK_SIZE, SERIALIZE_LOGGER
from engine.uploader.definition import Uploader


class DailymotionUploader(Uploader):
    base_url = "ABCDE"

    def __init__(self, logger_name: str = SERIALIZE_LOGGER):
        super().__init__()
        self.client = dailymotion.Dailymotion()

        # Load .env.local file temporarily from here-only for testing...
        dotenv_path = BASE_DIR / '.env.local'
        if path.isfile(dotenv_path):
            dotenv.load_dotenv(dotenv_path)
        self.logger = logging.getLogger(logger_name)
        self.api_key = getenv("DAILYMOTION_API_KEY")
        self.api_secret = getenv("DAILYMOTION_API_SECRET")
        self.username = getenv("DAILYMOTION_USERNAME")
        self.password = getenv("DAILYMOTION_PASSWORD")
        self.base_url_api = "https://partner.api.dailymotion.com/rest/"
        self.auth_url = "https://partner.api.dailymotion.com/oauth/v1/token"
        self.videos_url_template = "https://www.dailymotion.com/video/{}"
        self.client.set_grant_type('password',
                                   api_key=self.api_key,
                                   api_secret=self.api_secret,
                                   scope=['manage_videos'], info={"username": self.username, "password": self.password})
        self.authorization_header = None

        # self.body = {
        #     'grant_type': 'client_credentials',
        #     'client_id': self.api_key,
        #     'client_secret': self.api_secret,
        #     'scope': 'manage_videos upload_videos read_videos edit_videos delete_videos'
        # }
        # self.headers = {
        #     'Content-Type': 'application/x-www-form-urlencoded'
        # }

    def upload(self, file_path: str, progress_tracker: Callable[[float], None] = None) -> str:
        upload_url = self.__upload_video(file_path, progress_tracker)
        publish_url = self.__publish_uploaded_video(upload_url)
        return publish_url

    # Sending the video file to the upload url obtained in the previous function
    def __upload_video(self, file_path, tracker: Callable[[float], None]):

        video_size = os.stat(file_path).st_size
        chunk_amount = video_size / UPLOAD_VIDEO_CHUNK_SIZE

        def progress_tracker(bytes_written, total_size):
            percent = self.__get_percent_progress(bytes_written, total_size)
            self.logger.debug(f"{file_path}: Uploaded {percent}%")
            if tracker is not None:
                tracker(percent)

        try:
            upload_url = self.client.upload(file_path, workers=chunk_amount, progress=progress_tracker)
            return upload_url
        except Exception as e:
            self.logger.error(e, exc_info=True)
            raise e

    def __publish_uploaded_video(self, uploaded_url):
        '''
        Now that your video has been uploaded, you can publish it to make it visible
        '''

        pub_url = self.client.post(
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
