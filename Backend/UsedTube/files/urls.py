from django.urls import path
from . import views

urlpatterns = [
    path('download/', views.handle_file_download)
]