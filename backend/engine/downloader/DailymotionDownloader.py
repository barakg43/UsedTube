import uuid

import youtube_dl

from engine.constants import ITEMS_READY_FOR_PROCESSING
from engine.downloader.definition import Downloader


class DailymotionDownloader(Downloader):
    def __init__(self,logger=None):

        self.download_percent = 0.0
        self.logger = logger
        self.video_downloaded_path=None
        pass

    def download_hook(self, downloader):
        if downloader['status'] == 'downloading':
            percent_str = downloader.get('_percent_str', '0%').strip().replace('%', '')
            self.download_percent = float(percent_str)
        elif downloader['status'] == 'finished':
            self.video_downloaded_path=downloader["filename"]


    def download(self, video_url: str):

        ydl_opts = {
            'outtmpl': f'{ITEMS_READY_FOR_PROCESSING}/{uuid.uuid1()}_%(title)s.%(ext)s',
            'progress_hooks': [self.download_hook],
            "logger":self.logger
        }
        with youtube_dl.YoutubeDL(ydl_opts) as ydl:
            ydl.download([video_url.strip()])

        return self.video_downloaded_path
    def get_download_percent(self):
        return self.download_percent

