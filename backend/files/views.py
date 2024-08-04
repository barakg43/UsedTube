import os

from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.core.cache import cache
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied, ValidationError
from django.http import HttpRequest, FileResponse, JsonResponse
from rest_framework import status
from rest_framework.views import APIView
from constants import FILE, ERROR, JOB_ID, MESSAGE
from engine.constants import SF_4_SIZE, ITEMS_READY_FOR_PROCESSING
from engine.downloader.YouTubeDownloader import YouTubeDownloader
from engine.downloader.definition import Downloader
from engine.driver import Driver
from engine.manager import Mr_EngineManager
from files.models import File, Folder
from files.query import select_folder_subitems, get_folder_tree, get_parent_tree_array
from utils import get_user_object


class DownloadView(APIView):
    def get(self, request: HttpRequest, file_id: str):
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
        file_name = "sample-file2.pdf"
        # from the db extract video_url, compressed_file_size, content-type
        compressed_file_size = SF_4_SIZE  # in Bytes
        video_url = r"https://www.youtube.com/watch?v=jW9zNLdPH0M&ab_channel=GalAviezri"
        # use the downloader to download the video from url
        downloader: Downloader = YouTubeDownloader()  # choose based on URL
        print("ABOUT TO DOWNLOAD")
        downloaded_video_path = downloader.download(video_url)
        print("FINISHED, ABOUT TO TRANSFORM VIDEO TO FILE")
        restored_file_path = Driver().process_video_to_file(
            downloaded_video_path, compressed_file_size, ""
        )
        print("FINISHED, ABOUT TO SEND RESULTS")
        os.remove(downloaded_video_path)
        return FileResponse(
            open(restored_file_path, "rb"),
            filename=file_name,
            as_attachment=True,
            content_type=None,
        )

class SerializationProgressView(APIView):
    def get(self, request: HttpRequest, job_id: str):
        if Mr_EngineManager.is_processing_done(job_id):
            path = Mr_EngineManager.get_processed_item_path(job_id)
            Mr_EngineManager.upload_video_to_providers(job_id, path)
            return JsonResponse({"progress": 1})
        return JsonResponse({"progress": Mr_EngineManager.get_action_progress(job_id)})
    
class UploadProgressView(APIView):
    def get(self, request: HttpRequest, job_id: str):
        if Mr_EngineManager.is_processing_done(job_id):
            # get the file id from the cache
            file_id = cache.get(job_id)
            
            # set url to the file
            file = File.objects.get(id=file_id)
            url = Mr_EngineManager.get_url(job_id)
            if url:
                file.url = url
                file.save()
                cache.delete(job_id)
                return JsonResponse({MESSAGE: "upload successful"})
            else:
                File.objects.delete(id=file_id)
                return JsonResponse({ERROR: 'upload failed'}, status=400)

        return JsonResponse({"progress": Mr_EngineManager.get_action_progress(job_id)})
    
# class RetrieveProcessedItemView(APIView):
#     def get(self, request: HttpRequest, job_id: str):
#         if Mr_EngineManager.is_processing_done(job_id):
#             processed_item_path = Mr_EngineManager.get_processed_item_path(job_id)
#             file_size = os.path.getsize(processed_item_path)
#             response = FileResponse(open(processed_item_path, 'rb'), as_attachment=True)
#             response.data = {'size': file_size}
#             return response
#         else:
#             return JsonResponse({ERROR: 'processing not done yet'}, status=400)


class UploadView(APIView):
    def post(self, request: HttpRequest, folder_id: str):
        if FILE not in request.FILES:
            return JsonResponse({ERROR: "no file provided"}, status=400)

        uploaded_file = request.FILES[FILE]

        # Save the uploaded file to disk
        file_path = os.path.join(ITEMS_READY_FOR_PROCESSING, uploaded_file.name)
        with open(file_path, "wb") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
                
        
        created_file = File.objects.create(name=uploaded_file.name, size=uploaded_file.size, folder_id=folder_id, owner=request.user, url='')
        job_id = Mr_EngineManager.process_file_to_video_async(str(file_path))
        
        cache.set(job_id, created_file.id, timeout=None)
        
        return JsonResponse({JOB_ID: job_id})



class UsedSpaceView(APIView):  #
    def get(self, request: HttpRequest):
        used_space = request.user.used_space.first()
        return JsonResponse({"value": used_space.value})


class DirectoryTree(APIView):
    def get(self, request):
        try:
            user = get_user_object(request)
            folder_tree = get_folder_tree(user)
        except ObjectDoesNotExist as e:
            return JsonResponse({ERROR: e.args[0]}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse(folder_tree)


class DirectoryContentView(APIView):
    def get(self, request, folder_id: str = None):
        # create a json listing all files and their size of the requested folder
        user = get_user_object(request)
        if folder_id is None:
            folder_id = user.root_folder.id
        try:
            folder_subitems_dict = select_folder_subitems(user, folder_id)
            folder_subitems_dict["parents"] = get_parent_tree_array(user, folder_id)
        except PermissionDenied as e:
            return JsonResponse({ERROR: e.args[0]}, status=status.HTTP_403_FORBIDDEN)
        except (ObjectDoesNotExist, ValidationError) as e:
            return JsonResponse({ERROR: e.args[0]}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse(folder_subitems_dict)


class CreateNewFolderView(APIView):
    def post(self, request: HttpRequest):
        folder_name = request.data.get("folderName")
        active_directory_id = request.data.get("parentId")

        if not folder_name:
            return JsonResponse({"error": "Folder name is required"}, status=400)
        if not active_directory_id:
            return JsonResponse({"error": "active directory is required"}, status=400)

        try:
            parent_folder = Folder.objects.filter(id=active_directory_id).get()
            new_folder = Folder.objects.create(
                name=folder_name, parent=parent_folder, owner=get_user_object(request),created_at=timezone.now()
            )

            return JsonResponse(
                {
                    "new folder": new_folder.name,
                    "parent id": active_directory_id,
                },
                status=201,
            )
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

class DeleteNodeView(APIView):
    
    def __delete_folder(self, folder: Folder):
        for item in folder.items.all():
            if isinstance(item, Folder):
                self.__delete_folder(item)
            else:
                item.delete()
        folder.delete()
        
    def delete(self, request: HttpRequest, node_id: str):
        if not node_id:
            return JsonResponse({"error": "node id is required"}, status=400)
        
        if File.objects.filter(id=node_id).exists():
            File.objects.filter(id=node_id).delete()
            return JsonResponse({"message": "file deleted successfully"}, status=200)
        
        if Folder.objects.filter(id=node_id).exists():
            folder = Folder.objects.filter(id=node_id).get()
            self.__delete_folder(folder)
            return JsonResponse({"message": "folder deleted successfully"}, status=200)
        
        return JsonResponse({"error": "node not found"}, status=404)
        