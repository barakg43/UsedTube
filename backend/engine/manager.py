from concurrent.futures import ThreadPoolExecutor, Future
from threading import Lock
from typing import Dict, Tuple
from uuid import uuid1
from engine.driver import Driver
from engine.progress_tracker import Tracker



class EngineManager:
    _progress_tracker = Tracker
    _instance = None
    _lock = Lock()

    def get_progress(self, uuid) -> float:
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

    def process_video_to_file_async(self, video_path: str, compressed_file_size: int) -> uuid1:
        uuid = str(uuid1())
        self.uuid_to_future[uuid] = self.workers.submit(Driver().process_video_to_file, video_path,
                                                        compressed_file_size, uuid)
        return uuid

    def get_processed_item_path(self, uuid) -> Tuple[str, int] | str:
        future = self.uuid_to_future[uuid]
        results = future.result()
        del self.uuid_to_future[uuid]
        Tracker.delete(uuid)
        
        return results

    def is_processing_done(self, uuid) -> bool:
        return self.uuid_to_future[uuid].done()

Mr_EngineManager: EngineManager = EngineManager()