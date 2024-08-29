import uuid
from pathlib import Path
from typing import Callable

import yt_dlp

from django_server.settings import DEBUG
from engine.constants import ITEMS_READY_FOR_PROCESSING
from engine.downloader.definition import Downloader


class DailymotionDownloader(Downloader):
    def __init__(self, logger=None, progress_tracker: Callable[[float], None] = None):

        self.download_percent = 0.0
        self.progress_tracker = progress_tracker
        self.logger = logger
        self.video_downloaded_path = None
        pass

    def download_hook(self, downloader):
        if downloader['status'] == 'downloading':
            percent_str = downloader.get('_percent_str', '0%').strip().replace('%', '')
            self.download_percent = float(percent_str)
            if self.progress_tracker is not None:
                self.progress_tracker(self.download_percent / 100)
        elif downloader['status'] == 'finished':
            self.video_downloaded_path = downloader["filename"]

    def download(self, video_url: str, debug=False) -> Path:

        ydl_opts = {
            'outtmpl': f'{ITEMS_READY_FOR_PROCESSING}/{uuid.uuid1()}_%(title)s.%(ext)s',
            'progress_hooks': [self.download_hook],
            "logger": self.logger,
            # "verbose": debug,
            "format": "bestvideo[ext=mp4]/mp4",
            # "force−ipv4": True,
            # "cookies":f'{ITEMS_READY_FOR_PROCESSING}/cookies.txt',
        }
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url.strip()])

        return Path(self.video_downloaded_path)

    def get_download_percent(self):
        return self.download_percent
