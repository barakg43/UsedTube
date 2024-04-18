from django.contrib.auth.models import User
from django.shortcuts import render

# Create your views here.
from django.http import HttpRequest, HttpResponse
from django.template.context_processors import request
from django.views import View

from files.query import get_items_in_folder


class download(View):
    def get(self, request: HttpRequest):
        pass

class upload(View):
    def get(self, request: HttpRequest):
        return HttpResponse('hello world!')

