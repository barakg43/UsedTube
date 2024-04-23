from django.contrib.auth.models import User
from django.shortcuts import render

# Create your views here.
from django.http import HttpRequest, HttpResponse
from django.views import View
from engine.downloader.impl import YouTubeDownloader
from engine.downloader.definition import Downloader
from files.query import get_items_in_folder
from engine.driver import Driver


class Download(View):
    def get(self, request: HttpRequest):
        # receive user request to download file
        # you get in request: user id, file_name
        # from the db extract video_url, compressed_file_size
        compressed_file_size = 10  # in Bytes
        video_url = r"https://www.youtube.com/watch?v=0EqSXDwTq6U&ab_channel=jasminmakeup"
        # use the downloader to download the video from url
        downloader: type(Downloader) = YouTubeDownloader  # choose based on URL
        downloaded_video_path = downloader.download(video_url)
        restored_file_path = Driver.process_video_to_file(downloaded_video_path, compressed_file_size)
        pass


class Upload(View):
    def get(self, request: HttpRequest):
        return HttpResponse('hello world!')
