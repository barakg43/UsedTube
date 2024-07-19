from abc import ABC, abstractmethod


class Uploader(ABC):
    
    @abstractmethod
    def upload(self, file_path: str):
        pass