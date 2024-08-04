import uuid

import youtube_dl

from engine.constants import ITEMS_READY_FOR_PROCESSING
from engine.downloader.definition import Downloader


class DailymotionDownloader(Downloader):
    def __init__(self):
        self.download_percent = 0
        pass

    def download_hook(self, downloader):
        if downloader['status'] == 'downloading':
            percent_str = downloader.get('_percent_str', '0%').strip().replace('%', '')
            self.download_percent = int(percent_str)
            # print(f"Download progress: {percent_str}")

    def download(self, video_url: str):
        ydl_opts = {
            'outtmpl': f'{ITEMS_READY_FOR_PROCESSING}/{uuid.uuid1()}_%(title)s.%(ext)s',
            'progress_hooks': [self.download_hook],
        }
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url.strip()])

    def get_download_percent(self):
        return self.download_percent

