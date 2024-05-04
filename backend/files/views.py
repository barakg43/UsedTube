import json, os
from typing import Union, Iterator, Set

from django.contrib.auth.decorators import login_required
from django.http import HttpRequest, HttpResponse, FileResponse, JsonResponse
from django.views import View
from constants import *
from engine.constants import SF_4_SIZE, ITEMS_READY_FOR_PROCESSING
from engine.downloader.impl import YouTubeDownloader
from engine.downloader.definition import Downloader
from files.models import Folder, File
from engine.driver import Driver
from itertools import chain


class DownloadView(View):
    @login_required
    def get(self, request: HttpRequest):
        # receive user request to download file
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

        driver = Driver()
        serialized_file_as_video_path, compressed_file_size = driver.process_file_to_video(str(file_path))

        # Send back the modified file as an attachment
        with open(serialized_file_as_video_path, 'rb') as modified_file:
            response = HttpResponse(modified_file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
            return response


class UsedSpaceView(View): #
    def get(self, request: HttpRequest):
        used_space = request.user.used_space.first()
        return JsonResponse({'value': used_space.value})


class DirectoryContentView(View):
    def get(self, request: HttpRequest):
        def properties_dict(_subitem: File | Folder):
            properties = {
                ITEM_TYPE: FILE if isinstance(_subitem, File) else FOLDER,
                NAME: _subitem.name.value_to_string(),
            }

            if properties[ITEM_TYPE] == FILE:
                properties[EXTENSION] = _subitem.extension.value_to_string()
                properties[SIZE] = _subitem.size.value_to_string()

            return properties

        # create a json listing all files and their size of the requested folder
        if request.content_type == 'application/json':
            folder_subitems = self.__select_folder_subitems(request)
            return JsonResponse(list(map(properties_dict, folder_subitems)))
        else:
            return JsonResponse({ERROR: 'bad request'}, 400)



    def __select_folder_subitems(self, request) -> Iterator[Union[Folder, File]]:
        user = request.user
        folder_properties = json.loads(request.body)
        folder = Folder.objects.filter(
            owner=user, parent=folder_properties[PARENT], name=folder_properties[NAME]
        )
        sub_folders = Folder.objects.filter(owner=user, parent=folder)
        files = File.objects.filter(owner=user, folder=folder)
        return chain(sub_folders, files)