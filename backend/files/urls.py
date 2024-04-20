from django.urls import path

from .views import upload, download

urlpatterns =[
    path('download/', download.as_view()),
    path('upload', upload.as_view())
]