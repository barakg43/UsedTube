from django.shortcuts import render

# Create your views here.
from django.http import HttpRequest, HttpResponse


def handle_file_download(request: HttpRequest):
    return HttpResponse('hello world!')

def handle_file_upload(request: HttpRequest):
    return HttpResponse('hello world!')