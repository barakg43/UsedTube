from abc import ABC, abstractmethod
from os.path import dirname
from pathlib import Path


class Downloader(ABC):
    tmp_folder = Path(dirname(__file__)).parent / "tmp"

    @abstractmethod
    @staticmethod
    def download(link) -> Path:
        pass