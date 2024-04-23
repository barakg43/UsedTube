from abc import ABC, abstractmethod
from os.path import dirname
from pathlib import Path


class Downloader(ABC):

    @abstractmethod
    @staticmethod
    def download(link) -> Path:
        pass