from pathlib import Path

from engine.constants import VIDEOS_READY_FOR_PROCESSING
from engine.downloader.definition import Downloader
from pytube import YouTube
import uuid


class YouTubeDownloader(Downloader):

    @staticmethod
    def download(link) -> Path:
        yt = YouTube(link)
        stream = yt.streams.get_highest_resolution()
        output_path = f"{VIDEOS_READY_FOR_PROCESSING}/{uuid.uuid1()}.mp4"
        stream.download(output_path=output_path)
        return Path(output_path)



