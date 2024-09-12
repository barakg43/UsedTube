import logging
import os
from concurrent.futures import ThreadPoolExecutor, Future
from threading import Lock
from typing import Dict, Tuple, Callable
from uuid import uuid1

from engine.constants import GENERAL_LOGGER
from engine.downloader.definition import Downloader
from engine.downloader.video_downloader import VideoDownloader
from engine.driver import Driver
from engine.uploader.Dailymotion.uploader import DailymotionUploader, Mr_DailymotionUploader
from engine.uploader.Vimeo.uploader import Mr_VimeoUploader
from engine.uploader.YouTube.uploader import Mr_YoutubeUploader


class EngineManager:
    _instance = None
    _lock = Lock()

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if getattr(self, 'initialized', False):
            return
        self.initialized = True
        self.workers = ThreadPoolExecutor(10)
        self.driver = Driver()
        self.uuid_to_future: Dict[uuid1, Future] = {}
        self.uuid_to_progress: Dict[uuid1, float] = {}

    def __del__(self):
        self.workers.shutdown()

    # def process_file_to_video_async(self, file_path: str) -> uuid1:
    #     uuid = str(uuid1())
    #     self.uuid_to_future[uuid] = self.workers.submit(self.driver.process_file_to_video, file_path)
    #     return uuid

    def process_file_to_video_with_upload(self, file_path: str, job_id: uuid1, providers: dict,
                                          progress_tracker: Callable[[int, float], None] = None) -> Tuple[str, int]:
        video_path, zipped_file_size = self.driver.process_file_to_video(file_path, job_id, progress_tracker)
        os.remove(file_path)

        def update_upload_progress(progress: int):
            progress_tracker(3, progress)

        url_result = self.__upload_video_to_providers(job_id, video_path, providers, update_upload_progress)
        os.remove(video_path)
        return url_result, zipped_file_size

    def process_video_to_file_async(self, video_path: str, compressed_file_size: int) -> uuid1:
        uuid = str(uuid1())
        self.uuid_to_future[uuid] = self.workers.submit(self.driver.process_video_to_file, video_path,
                                                        compressed_file_size, uuid)
        return uuid

    def process_video_to_file_with_download(self,
                                            video_urls: str,
                                            compressed_file_size: int,
                                            job_id: uuid1,
                                            progress_tracker: Callable[[int, float], None] = None) -> str:
        def update_download_progress(progress: float):
            progress_tracker(1, progress)

        downloaded_video_path = None
        downloader: Downloader = VideoDownloader(logger=logging.Logger(GENERAL_LOGGER),
                                                 progress_tracker=update_download_progress)
        url_array = video_urls.split(",")
        for video_url in url_array:
            try:
                downloaded_video_path = downloader.download(video_url)
                break
            except Exception as e:
                logging.error(e)
                continue
        restored_file_path = self.driver.process_video_to_file(
            downloaded_video_path.as_posix(), compressed_file_size, job_id, progress_tracker
        )
        os.remove(downloaded_video_path)
        return restored_file_path

    def get_processed_item_path_size(self, uuid) -> Tuple[str, int] | str:
        future = self.uuid_to_future[uuid]
        results = future.result()
        del self.uuid_to_future[uuid]

        return results

    def is_processing_done(self, uuid) -> bool:
        future = self.uuid_to_future.get(uuid, None)
        if future is not None:
            return future.done()
        raise KeyError(f"uuid {uuid} not found")

    def __upload_video_to_providers(self, job_id, video_path: str, providers: dict,
                                    update_upload_progress: Callable[[int], None]) -> str:
        url_array = []
        for provider in providers:
            if provider.name == "dailymotion":
                url_array.append(Mr_DailymotionUploader.upload(video_path, provider.api_keys, update_upload_progress))
            elif provider == "vimeo":
                url_array.append(Mr_VimeoUploader.upload(video_path, provider.api_keys, update_upload_progress))
            elif provider == "youtube":
                url_array.append(Mr_YoutubeUploader.upload(video_path, provider.api_keys, update_upload_progress))

        video_final_urls = ",".join(url_array)
        return video_final_urls

    def get_url(self, uuid) -> str:
        future = self.uuid_to_future[uuid]
        results = future.result()
        del self.uuid_to_future[uuid]
        return DailymotionUploader.base_url + results if results else results

    def cancel_action(self, uuid):
        future = self.uuid_to_future[uuid]
        future.cancel()
        del self.uuid_to_future[uuid]


Mr_EngineManager: EngineManager = EngineManager()
