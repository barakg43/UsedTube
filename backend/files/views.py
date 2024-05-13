import json
import os
from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, FileResponse, JsonResponse
from django.views import View

from constants import FILE, ERROR, JOB_ID, ITEM_TYPE, FOLDER, EXTENSION, NAME, SIZE
from engine.constants import SF_4_SIZE, ITEMS_READY_FOR_PROCESSING
from engine.downloader.definition import Downloader
from engine.downloader.impl import YouTubeDownloader
from engine.driver import Driver
from engine.manager import Mr_EngineManager
from files.models import Folder, File
from files.query import select_folder_subitems


class DownloadView(View):
    @login_required
    def get(self, request: HttpRequest):
        user = request.user
        # you get in request: user id, file_name
        # The `file_name` variable in the `DownloadView` class is being set to 'sample-file2.pdf'.
        # This variable is used to specify the name of the file that will be downloaded by the user.
        # It is later used when returning the `FileResponse` in the `get` method of the `DownloadView`
        # class to provide the downloaded file with a specific filename when it is sent back to the
        # user for download.
        # The `file_name` variable in the `DownloadView` class is being set to 'sample-file2.pdf'.
        # This variable is used to specify the name of the file that will be downloaded by the user.
        # It is later used when returning the `FileResponse` in the `get` method of the `DownloadView`
        # class to provide the downloaded file with a specific filename when it is sent back to the
        # user for download.
        file_name = 'sample-file2.pdf'
        # from the db extract video_url, compressed_file_size, content-type
        compressed_file_size = SF_4_SIZE  # in Bytes
        video_url = r"https://www.youtube.com/watch?v=jW9zNLdPH0M&ab_channel=GalAviezri"
        # use the downloader to download the video from url
        downloader: Downloader = YouTubeDownloader  # choose based on URL
        print("ABOUT TO DOWNLOAD")
        downloaded_video_path = downloader.download(video_url)
        print("FINISHED, ABOUT TO TRANSFORM VIDEO TO FILE")
        restored_file_path = Driver().process_video_to_file(downloaded_video_path, compressed_file_size)
        print("FINISHED, ABOUT TO SEND RESULTS")
        os.remove(downloaded_video_path)
        return FileResponse(open(restored_file_path, 'rb'),
                            filename=file_name,
                            as_attachment=True,
                            content_type=None)


class UploadView(View):
    @login_required
    def post(self, request: HttpRequest):
        # Check if file was uploaded
        # WHAT ABOUT CREATION OF A FOLDER?
        # IF FOLDER CREATION:
        #   PASS
        # ELSE:
        if FILE not in request.FILES:
            return JsonResponse({ERROR: 'no file provided'}, status=400)

        uploaded_file = request.FILES[FILE]

        # Save the uploaded file to disk
        file_path = os.path.join(ITEMS_READY_FOR_PROCESSING, uploaded_file.name)
        with open(file_path, 'wb') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        return JsonResponse({JOB_ID: Mr_EngineManager.process_file_to_video_async(str(file_path))})

    @login_required
    def get(self, request: HttpRequest):
        job_id = json.loads(request.body)[JOB_ID]
        if Mr_EngineManager.is_processing_done(job_id):
            # return the video to upload
            pass
        else:
            return JsonResponse({})


class UsedSpaceView(View):  #
    def get(self, request: HttpRequest):
        used_space = request.user.used_space.first()
        return JsonResponse({'value': used_space.value})


class DirectoryContentView(View):

    # @login_required
    def get(self, request: HttpRequest, folder_id: int):
        # create a json listing all files and their size of the requested folder
        if request.content_type == 'application/json':
            folder_subitems = select_folder_subitems(request.user, folder_id)
            return JsonResponse(folder_subitems)
        else:

            return JsonResponse({ERROR: 'bad request'}, status=400)

    