from django.urls import path

from .views import *

urlpatterns =[
    path('download/<str:file_id>', DownloadView.as_view()),
    path('upload/<str:folder_id>', UploadView.as_view()),
    path('used-space', UsedSpaceView.as_view(), name='used_space'),
    path('dir-content/<str:folder_id>', DirectoryContentView.as_view()),
    path('dir-content/', DirectoryContentView.as_view()),
    path('create-folder', CreateNewFolderView.as_view()),
    path("dir-tree/", DirectoryTree.as_view()),
    path('upload/progress/<str:job_id>', ProgressView.as_view()),
    path('retrieve/<str:job_id>', RetrieveProcessedItemView.as_view())
]