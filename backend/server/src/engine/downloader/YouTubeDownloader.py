from pytube import YouTube

from engine.constants import ITEMS_READY_FOR_PROCESSING
from engine.downloader.definition import Downloader


class YouTubeDownloader(Downloader):

    # @staticmethod
    def download(self, video_url: str) -> str:
        yt = YouTube(video_url)
        return yt.streams.filter(res="720p").first().download(output_path=ITEMS_READY_FOR_PROCESSING)
