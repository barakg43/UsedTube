from django.contrib.auth.models import User
from django.shortcuts import render

# Create your views here.
from django.http import HttpRequest, HttpResponse
from django.views import View

from files.query import get_items_in_folder


class Download(View):
    def get(self, request: HttpRequest):
        pass

class Upload(View):
    def get(self, request: HttpRequest):
        return HttpResponse('hello world!')

