from pathlib import Path
from typing import override
from backend.engine.downloader.definition import Downloader
from pytube import YouTube
import uuid


class YouTubeDownloader(Downloader):

    @override
    @staticmethod
    def download(link) -> Path:
        yt = YouTube(link)
        stream = yt.streams.get_highest_resolution()
        output_path = f"{Downloader.tmp_folder}/{uuid.uuid1()}.mp4"
        stream.download(output_path=output_path)
        return Path(output_path)



