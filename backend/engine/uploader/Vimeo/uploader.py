import logging
import os
from typing import Callable

from engine.constants import UPLOAD_VIDEO_CHUNK_SIZE, SERIALIZE_LOGGER
from engine.uploader.Vimeo.internal_libaray import vimeo
from engine.uploader.definition import Uploader


# import vimeo


class VimeoUploader(Uploader):
    def __init__(self, logger_name: str = SERIALIZE_LOGGER):
        super().__init__()

        self.client = vimeo.VimeoClient(
            token='e33ff6be2852427d4adb73ebb8a684fc',
            key='7eeff6c80dfa52c5595e578317a80b85b6b4b44e',
            secret='WXuNMiktYVwy7Y0cY3Q/o/uYstlDI2a6Of/SLhKQMCk7s5hf57PMowmOSR7psw9Z4JuwmoAEBmxw1/o/DiL4RyZDfXwfFo/C8EQgriOthomUBs60exIc6xorrHSagLai'
        )
        self.logger = logging.getLogger(logger_name)
        self.videos_url_template = "https://www.vimeo.com/{}"
        # file_name = 'C:\\Users\\Barak\\Downloads\\Careers.mp4'
        # uri = self.client.upload(file_name,None, data={
        #     'name': 'Careers',
        # })
        # print(uri)
        # self.client = dailymotion.Dailymotion()
        #
        # # Load .env.local file temporarily from here-only for testing...
        # dotenv_path = BASE_DIR / '.env.local'
        # if path.isfile(dotenv_path):
        #     dotenv.load_dotenv(dotenv_path)

        # self.api_key = getenv("DAILYMOTION_API_KEY")
        # self.api_secret = getenv("DAILYMOTION_API_SECRET")
        # self.username = getenv("DAILYMOTION_USERNAME")
        # self.password = getenv("DAILYMOTION_PASSWORD")
        # self.base_url_api = "https://partner.api.dailymotion.com/rest/"
        # self.auth_url = "https://partner.api.dailymotion.com/oauth/v1/token"

        # self.client.set_grant_type('password',
        #                            api_key=self.api_key,
        #                            api_secret=self.api_secret,
        #                            scope=['manage_videos'], info={"username": self.username, "password": self.password})
        # self.authorization_header = None

        # self.body = {
        #     'grant_type': 'client_credentials',
        #     'client_id': self.api_key,
        #     'client_secret': self.api_secret,
        #     'scope': 'manage_videos upload_videos read_videos edit_videos delete_videos'
        # }
        # self.headers = {
        #     'Content-Type': 'application/x-www-form-urlencoded'
        # } api_key: dict[str]


    def upload(self, file_path: str, progress_tracker: Callable[[float], None] = None) -> str:
        upload_url = self.__upload_video(file_path, progress_tracker)
        publish_url = self.__publish_uploaded_video(upload_url)
        return publish_url

    # Sending the video file to the upload url obtained in the previous function
    def __upload_video(self, file_path, tracker: Callable[[float], None]):

        def progress_tracker(bytes_written, total_size):
            percent = bytes_written / total_size
            self.logger.info(f"{file_path}:Vimeo Uploaded {percent * 100:.2f}%")
            if tracker is not None:
                tracker(percent)


        try:
            upload_url = self.client.upload(file_path, progress=progress_tracker,data={"chunk_size": UPLOAD_VIDEO_CHUNK_SIZE//5})
            return upload_url
        except Exception as e:
            self.logger.error(e, exc_info=True)
            raise e

    def __publish_uploaded_video(self, uploaded_url):
        '''
        Now that your video has been uploaded, you can publish it to make it visible
        '''

        video_id = uploaded_url.split('/')[-1]
        return self.videos_url_template.format(video_id)

    def __get_percent_progress(self, current, total):
        """
        Example of function which prints the percentage of progression
        :param current: current bytes sent
        :param total: total bytes
        :return: percent number
        """
        percent = round((min((current * 100) / total, 100)), 2)
        return percent


Mr_VimeoUploader = VimeoUploader()
