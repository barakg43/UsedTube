import os
from concurrent.futures import ThreadPoolExecutor
from uuid import uuid1

from django.core.files.uploadedfile import InMemoryUploadedFile

from account.models import AppUser
from engine.constants import ITEMS_READY_FOR_PROCESSING
from engine.manager import Mr_EngineManager
from files.models import File


class FileController:
    def __init__(self):
        self.workers = ThreadPoolExecutor(20)
        self.engine_manger = Mr_EngineManager
        # self.uuid_to_future: Dict[uuid1, Future] = {}
        # self.uuid_to_progress: Dict[uuid1, float] = {}

    def save_file_to_video_provider_async(self, user: AppUser, uploaded_file: InMemoryUploadedFile, folder_id: str):
        job_id = str(uuid1())
        file_path = os.path.join(ITEMS_READY_FOR_PROCESSING, f"{job_id}_{uploaded_file.name}")
        with open(file_path, "wb") as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)
        self.workers.submit(self.__save_file_to_video_provider_task,
                            job_id,
                            user,
                            file_path,
                            uploaded_file.name,
                            uploaded_file.size,
                            folder_id)
        return job_id

    def __save_file_to_video_provider_task(self, job_id, user: AppUser, file_path: str, file_name_with_ext: str,
                                           file_size: int,
                                           folder_id: str):
        url_result, compressed_size = self.engine_manger.process_file_to_video_with_upload(file_path, job_id)
        file_name_array = file_name_with_ext.split(".")
        file_name = file_name_array[0]
        ext = file_name_array[1]
        File.objects.create(name=file_name,
                            size=file_size,
                            compressed_size=compressed_size,
                            extension=ext,
                            folder_id=folder_id,
                            owner=user,
                            url=url_result)


class JobDetails:
    def __init__(self, user: AppUser):
        self.error: str = None
        self.user: AppUser = user
        self.uuid_to_error: Dict[uuid1, str] = {}

    def get_error(self):
        return self.error

    def get_user(self):
        return self.user

    def set_error(self, error: str):
        self.error = error


file_controller = FileController()
