from abc import ABC, abstractmethod


class Downloader(ABC):

    @abstractmethod
    def download(self, link):
        pass
