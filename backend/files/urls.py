from django.urls import path
from .views import *

urlpatterns =[
    path('download', Download.as_view()),
    path('upload', Upload.as_view()),
    path('used-space', UsedSpace.as_view())
]