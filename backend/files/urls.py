from django.urls import path

from .views import handle_file_upload, handle_file_download

urlpatterns =[
    path('download/', handle_file_download),
    path('upload', handle_file_upload)
]