import os
from concurrent.futures import ThreadPoolExecutor, Future
from threading import Lock
from typing import Dict, Tuple
from uuid import uuid1

from engine.downloader.DailymotionDownloader import DailymotionDownloader
from engine.downloader.definition import Downloader
from engine.driver import Driver
from engine.progress_tracker import Tracker
from engine.uploader.Dailymotion.uploader import DailymotionUploader


class EngineManager:
    _progress_tracker = Tracker
    _instance = None
    _lock = Lock()

    def get_action_progress(self, uuid) -> float:
        return self._progress_tracker.get_progress(uuid)

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
        self.uuid_to_future: Dict[uuid1, Future] = {}
        self.uuid_to_progress: Dict[uuid1, float] = {}

    def __del__(self):
        self.workers.shutdown()

    def process_file_to_video_async(self, file_path: str) -> uuid1:
        uuid = str(uuid1())
        self.uuid_to_future[uuid] = self.workers.submit(Driver().process_file_to_video, file_path, uuid)
        return uuid

    def process_file_to_video_with_upload(self, file_path: str, job_id: uuid1) -> Tuple[str, int]:
        video_path, zipped_file_size = Driver().process_file_to_video(file_path, job_id)
        url_result = self.__upload_video_to_providers(job_id, video_path)
        return url_result, zipped_file_size

    def process_video_to_file_async(self, video_path: str, compressed_file_size: int) -> uuid1:
        uuid = str(uuid1())
        self.uuid_to_future[uuid] = self.workers.submit(Driver().process_video_to_file, video_path,
                                                        compressed_file_size, uuid)
        return uuid
    def process_video_to_file_with_download(self, video_url: str, compressed_file_size: int, job_id: uuid1) -> str:
        downloader: Downloader = DailymotionDownloader()  # choose based on URL
        downloaded_video_path = downloader.download(video_url)
        restored_file_path = Driver().process_video_to_file(
            downloaded_video_path, compressed_file_size, job_id
        )
        # os.remove(downloaded_video_path)
        return restored_file_path
    def get_processed_item_path_size(self, uuid) -> Tuple[str, int] | str:
        future = self.uuid_to_future[uuid]
        results = future.result()
        del self.uuid_to_future[uuid]
        Tracker.delete(uuid)

        return results

    def is_processing_done(self, uuid) -> bool:
        future = self.uuid_to_future.get(uuid, None)
        if future is not None:
            return future.done()
        raise KeyError(f"uuid {uuid} not found")

    def __upload_video_to_providers(self, job_id, video_path: str) -> str:
        # self.uploader: Uploader = YouTubeUploader(job_id, self._progress_tracker)
        uploader = DailymotionUploader()
        # self.uuid_to_future[job_id] = self.workers.submit(self.uploader.upload, video_path)
        video_final_url = uploader.upload(video_path)
        Tracker.set_progress(job_id, 1)
        return video_final_url

    def get_url(self, uuid) -> str:
        future = self.uuid_to_future[uuid]
        results = future.result()
        del self.uuid_to_future[uuid]
        return DailymotionUploader.base_url + results if results else results


Mr_EngineManager: EngineManager = EngineManager()
