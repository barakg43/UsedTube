from pathlib import Path

from engine.constants import VIDEOS_READY_FOR_PROCESSING
from engine.downloader.definition import Downloader
from pytube import YouTube
import uuid


class YouTubeDownloader(Downloader):

    @staticmethod
    def download(link) -> str:
        yt = YouTube(link)
        return yt.streams.filter(res="720p").first().download(output_path=VIDEOS_READY_FOR_PROCESSING)



