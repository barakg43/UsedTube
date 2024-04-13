from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
# Create your views here.



def handle_download_request(request: HttpRequest):
    # eventually the received data is user-token, virtual file full path,
    # given that information we can fetch the corresponding video url from db
    # then using engine.downloader to download the video
    # unserialize the video
    # return the original file
    return HttpResponse("Hello World")