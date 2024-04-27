from django.contrib.auth.models import User
from django.shortcuts import render
import os
from django.http import HttpRequest, HttpResponse, FileResponse
from django.views import View

from engine.constants import SF_3_SIZE, SF_4_SIZE
from engine.downloader.impl import YouTubeDownloader
from engine.downloader.definition import Downloader
from files.query import get_items_in_folder
from engine.driver import Driver


class Download(View):
    def get(self, request: HttpRequest):
        # receive user request to download file
        # you get in request: user id, file_name
        file_name = 'sample-file2.pdf'
        # from the db extract video_url, compressed_file_size, content-type
        compressed_file_size = SF_4_SIZE  # in Bytes
        video_url = r"https://www.youtube.com/watch?v=jW9zNLdPH0M&ab_channel=GalAviezri"
        # use the downloader to download the video from url
        downloader: Downloader = YouTubeDownloader  # choose based on URL
        print("ABOUT TO DOWNLOAD")
        downloaded_video_path = downloader.download(video_url)
        print("FINISHED, ABOUT TO TRANSFORM VIDEO TO FILE")
        restored_file_path = Driver().process_video_to_file(downloaded_video_path, compressed_file_size)
        print("FINISHED, ABOUT TO SEND RESULTS")
        os.remove(downloaded_video_path)
        return FileResponse(open(restored_file_path, 'rb'),
                            filename=file_name,
                            as_attachment=True,
                            content_type=None)


class Upload(View):
    def post(self, request: HttpRequest):

        return HttpResponse('hello world!')
