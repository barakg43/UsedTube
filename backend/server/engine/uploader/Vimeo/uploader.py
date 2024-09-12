import logging
from typing import Callable

from engine.constants import UPLOAD_VIDEO_CHUNK_SIZE, SERIALIZE_LOGGER
from engine.uploader.Vimeo.internal_libaray import vimeo
from engine.uploader.definition import Uploader


# import vimeo


class VimeoUploader(Uploader):
    def __init__(self, logger_name: str = SERIALIZE_LOGGER):
        super().__init__()
        self.logger = logging.getLogger(logger_name)
        self.videos_url_template = "https://www.vimeo.com/{}"

    def upload(self, file_path: str, api_keys: dict, progress_tracker: Callable[[float], None] = None) -> str:
        client = vimeo.VimeoClient(
            token=api_keys["token"],
            key=api_keys["key"],
            secret=api_keys["secret"],
        )
        upload_url = self.__upload_video(client, file_path, progress_tracker)
        publish_url = self.__publish_uploaded_video(upload_url)
        return publish_url

    # Sending the video file to the upload url obtained in the previous function
    def __upload_video(self, client, file_path, tracker: Callable[[float], None]):

        def progress_tracker(bytes_written, total_size):
            percent = bytes_written / total_size
            self.logger.info(f"{file_path}:Vimeo Uploaded {percent * 100:.2f}%")
            if tracker is not None:
                tracker(percent)

        try:
            upload_url = client.upload(file_path, progress=progress_tracker,
                                       data={"chunk_size": UPLOAD_VIDEO_CHUNK_SIZE // 5})
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


Mr_VimeoUploader = VimeoUploader()
