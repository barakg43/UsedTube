from abc import ABC, abstractmethod
from pathlib import Path


class Downloader(ABC):

    # @staticmethod
    @abstractmethod
    def download(self, video_url: str) -> Path:
        pass

    @abstractmethod
    def get_download_percent(self):
        pass
