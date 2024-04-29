from django.urls import path
from .views import *

urlpatterns =[
    path('download', Download.as_view()),
    path('upload', Upload.as_view()),
    path('used-space', UsedSpaceView.as_view(), name='used_space')
]