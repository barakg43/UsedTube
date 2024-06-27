from abc import ABC, abstractmethod
from pathlib import Path


class Downloader(ABC):


    @staticmethod
    @abstractmethod
    def download(link) -> Path:
        pass