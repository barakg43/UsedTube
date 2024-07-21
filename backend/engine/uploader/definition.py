from abc import ABC, abstractmethod
from typing import Callable


class Uploader(ABC):
    
    @abstractmethod
    def upload(self, file_path: str,progress_tracker: Callable[[float], None]=None):
        pass