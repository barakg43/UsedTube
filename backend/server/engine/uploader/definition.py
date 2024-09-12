from abc import ABC, abstractmethod
from enum import Enum
from typing import Callable


# class syntax
class Provider(Enum):
    DAILYMOTION = 1
    VIMEO = 2


class Uploader(ABC):

    @abstractmethod
    def upload(self, file_path: str, api_keys: dict, progress_tracker: Callable[[float], None] = None):
        pass
