from django.urls import path

from .views import *

urlpatterns = [
    path('download/<str:file_id>', DownloadView.as_view()),
    path('upload/<str:folder_id>', UploadView.as_view()),
    path('used-space', UsedSpaceView.as_view(), name='used_space'),
    path('dir-content/<str:folder_id>', DirectoryContentView.as_view()),
    path('dir-content/', DirectoryContentView.as_view()),
    path('create-folder', CreateNewFolderView.as_view()),
    path("dir-tree/", DirectoryTree.as_view()),
    path('upload/serialize/progress/<str:job_id>', SerializationProgressView.as_view()),
    path('upload/progress/<str:job_id>', UploadProgressView.as_view()),
    path('download/progress/<str:job_id>', DownloadViewProgressView.as_view()),
    path('delete/<str:node_id>', DeleteNodeView.as_view()),
]
