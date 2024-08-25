"""
Interface module defining a fingerprint generator based on file content.
"""
import abc
from typing import IO


class Fingerprint(abc.ABC):
    """An interface specifying the requirements of a file fingerprint"""

    @abc.abstractmethod
    def get_fingerprint(self, fs: IO):
        """
        Return a unique fingerprint string value based on the file stream recevied

        :Args:
            - fs[IO]: The file stream instance of the file for which a fingerprint would be generated.
        :Returns: fingerprint[str]
        """
