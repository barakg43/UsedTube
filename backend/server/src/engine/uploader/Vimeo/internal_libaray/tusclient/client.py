from typing import Dict, Optional

from engine.uploader.Vimeo.internal_libaray.tusclient.uploader.uploader import Uploader


class TusClient:
    """
    Object representation of Tus client.

    :Attributes:
        - url (str):
            represents the tus server's create extension url. On instantiation this argument
            must be passed to the constructor.
        - headers (dict):
            This can be used to set the server specific headers. These headers would be sent
            along with every request made by the cleint to the server. This may be used to set
            authentication headers. These headers should not include headers required by tus
            protocol. If not set this defaults to an empty dictionary.

    :Constructor Args:
        - url (str)
        - headers (Optiional[dict])
    """

    def __init__(self, url: str, headers: Optional[Dict[str, str]] = None):
        self.url = url
        self.headers = headers or {}

    def uploader(self, *args, **kwargs) -> Uploader:
        """
        Return uploader instance pointing at current client instance.

        Return uploader instance with which you can control the upload of a specific
        file. The current instance of the tus client is passed to the uploader on creation.

        :Args:
            see tusclient.uploader.Uploader for required and optional arguments.
        """
        kwargs["client"] = self
        return Uploader(*args, **kwargs)
