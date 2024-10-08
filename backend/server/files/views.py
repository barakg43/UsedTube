from django.core.exceptions import ObjectDoesNotExist, PermissionDenied, ValidationError
from django.http import HttpRequest, FileResponse, JsonResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.views import APIView

from constants import FILE, ERROR, JOB_ID, MESSAGE
from engine.manager import Mr_EngineManager
from files.controller import file_controller
from files.models import File, Folder
from files.query import select_folder_subitems, get_folder_tree, get_parent_tree_array
from sharing.models import SharedItem
from utils import get_user_object


class InitiateDownloadView(APIView):
    def get(self, request: HttpRequest, file_id: str):
        def shared_with_user(file: File, user):
            return SharedItem.objects.filter(file_item=file, shared_with=user).exists()

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
        file_to_download = File.objects.get(id=file_id)
        # if the file is shared with the user, then the user can download the file
        # or if the file is owned by the user, then the user can download the file
        # else the user is not authorized to download the file
        if file_to_download.owner != request.user and not shared_with_user(file_to_download, user):
            return JsonResponse({ERROR: "Not authorized to download this file"}, status=status.HTTP_401_UNAUTHORIZED)

        job_id = file_controller.get_file_from_provider_async(file_id, user)
        return JsonResponse({JOB_ID: job_id}, status=status.HTTP_202_ACCEPTED)


class DownloadProgressView(APIView):
    def get(self, request: HttpRequest, job_id: str):
        if file_controller.is_job_exist(job_id) is False:
            return JsonResponse({ERROR: "Job does not exist"}, status=status.HTTP_404_NOT_FOUND)
        job_owner = file_controller.get_user_for_job(job_id)
        if request.user != job_owner:
            return JsonResponse({ERROR: "Not authorized to view this download job status"},
                                status=status.HTTP_403_FORBIDDEN)
        job_error = file_controller.get_job_error(job_id)
        if job_error is not None:
            return JsonResponse({ERROR: job_error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            return JsonResponse({"progress": file_controller.get_job_progress(job_id)})


class DownloadView(APIView):
    def get(self, request: HttpRequest, job_id: str):
        response = None
        if file_controller.is_processing_done(job_id):
            # get the final file result from the future task
            bytes_io, file_name = file_controller.get_download_item_bytes_name(job_id)
            response = FileResponse(
                bytes_io,
                filename=file_name,
                as_attachment=True,
            )
            response['Access-Control-Expose-Headers'] = 'Content-Disposition'
        else:
            response = JsonResponse({ERROR: "Fuck You"}, status=status.HTTP_409_CONFLICT)
        return response


class SerializationProgressView(APIView):
    def get(self, request: HttpRequest, job_id: str):
        if Mr_EngineManager.is_processing_done(job_id):
            path = Mr_EngineManager.get_processed_item_path(job_id)
            Mr_EngineManager.upload_video_to_providers(job_id, path)
            return JsonResponse({"progress": 1})
        return JsonResponse({"progress": Mr_EngineManager.get_action_progress(job_id)})


class UploadView(APIView):
    def post(self, request: HttpRequest, folder_id: str):
        if FILE not in request.FILES:
            return JsonResponse({ERROR: "no file provided"}, status=400)
        folder = Folder.objects.filter(id=folder_id).get()
        if folder.owner != get_user_object(request):
            return JsonResponse({ERROR: "Not authorized to upload this folder"}, status=status.HTTP_403_FORBIDDEN)

        uploaded_file = request.FILES[FILE]
        user = get_user_object(request)
        user.storage_usage += uploaded_file.size
        user.save()
        job_id = file_controller.save_file_to_video_provider_async(request.user, uploaded_file, folder_id)
        return JsonResponse({JOB_ID: job_id}, status=201)


class UploadProgressView(APIView):
    def get(self, request: HttpRequest, job_id: str):
        if file_controller.is_job_exist(job_id) is False:
            return JsonResponse({ERROR: "Job does not exist"}, status=status.HTTP_404_NOT_FOUND)
        job_owner = file_controller.get_user_for_job(job_id)
        if request.user != job_owner:
            return JsonResponse({ERROR: "Not authorized to view this upload job status"},
                                status=status.HTTP_403_FORBIDDEN)
        job_error = file_controller.get_job_error(job_id)
        if job_error is not None:
            return JsonResponse({ERROR: job_error}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        job_complete_percentage = file_controller.get_job_progress(job_id)
        if job_complete_percentage == 1:
            file_controller.remove_job(job_id)

            return JsonResponse({"progress": 1.0})
        if file_controller.is_processing_done(job_id):
            return JsonResponse({ERROR: "there are internal server error"},
                                status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return JsonResponse({"progress": job_complete_percentage})


class CancelUploadView(APIView):
    def delete(self, request: HttpRequest, job_id: str):
        job_owner = file_controller.get_user_for_job(job_id)
        if request.user != job_owner:
            return JsonResponse({ERROR: "Not authorized to cancel this upload job"}, status=status.HTTP_403_FORBIDDEN)
        file_controller.cancel_action(job_id)
        return JsonResponse({MESSAGE: "Upload job cancelled"}, status=200)


class CancelDownloadView(APIView):
    def delete(self, request: HttpRequest, job_id: str):
        job_owner = file_controller.get_user_for_job(job_id)
        if request.user != job_owner:
            return JsonResponse({ERROR: "Not authorized to cancel this download job"}, status=status.HTTP_403_FORBIDDEN)
        file_controller.cancel_action(job_id)
        return JsonResponse({MESSAGE: "download job cancelled"}, status=200)


class UsedSpaceView(APIView):
    def get(self, request: HttpRequest):
        return JsonResponse({"value": get_user_object(request).storage_usage})


class DirectoryTree(APIView):
    def get(self, request):
        try:
            user = get_user_object(request)
            folder_tree = get_folder_tree(user)
        except ObjectDoesNotExist as e:
            return JsonResponse({ERROR: e.args[0]}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse(folder_tree)


class DirectoryContentView(APIView):
    def get(self, request, folder_id: str | None = None):
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
                name=folder_name, parent=parent_folder, owner=get_user_object(request), created_at=timezone.now()
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
    def __delete_folder(self, folder: Folder, user):

        files = folder.files.all()
        for file in files:
            user.storage_usage -= file.size
            user.save()
            file.delete()

        subfolders = Folder.objects.filter(parent=folder)

        for item in subfolders:
            self.__delete_folder(item)
        folder.delete()

    def delete(self, request: HttpRequest, node_id: str):
        user = get_user_object(request)
        if not node_id:
            return JsonResponse({"error": "node id is required"}, status=400)

        if File.objects.filter(id=node_id).exists():
            File.objects.filter(id=node_id).delete()
            user.storage_usage -= File.objects.get(id=node_id).size
            user.save()
            return JsonResponse({"message": "file deleted successfully"}, status=200)

        if Folder.objects.filter(id=node_id).exists():
            folder = Folder.objects.filter(id=node_id).get()
            self.__delete_folder(folder, user)
            return JsonResponse({"message": "folder deleted successfully"}, status=200)

        return JsonResponse({"error": "node not found"}, status=404)
