from abc import ABC, abstractmethod


class Uploader(ABC):
    def __init__(self):
        self.base_url = None
    @abstractmethod
    def upload(self, file_path: str):
        pass