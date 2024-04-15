from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

# Create your views here.

def handle_file_download(request: HttpRequest):
    return HttpResponse('hello world!')