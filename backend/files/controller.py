import io
import os
from concurrent.futures import ThreadPoolExecutor, Future
from typing import Dict, Tuple
from uuid import uuid1

from django.core.files.uploadedfile import InMemoryUploadedFile

from account.models import AppUser
from engine.constants import ITEMS_READY_FOR_PROCESSING
from engine.downloader.DailymotionDownloader import DailymotionDownloader
from engine.downloader.definition import Downloader
from engine.manager import Mr_EngineManager
from engine.serialization.serializer import deserialize_logger, serialize_logger
from files.models import File


class FileController:

    def __init__(self):
        self.workers = ThreadPoolExecutor(20)
        self.engine_manger = Mr_EngineManager
        self.uuid_to_jobDetails: Dict[uuid1, JobDetails] = {}
        self.logger=serialize_logger
        # self.uuid_to_future: Dict[uuid1, Future] = {}
        # self.uuid_to_progress: Dict[uuid1, float] = {}
    def save_file_to_video_provider_async(self, user: AppUser, uploaded_file: InMemoryUploadedFile, folder_id: str):
        job_id = str(uuid1())
        try:
            self.uuid_to_jobDetails[job_id] = JobDetails(user)
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
        except Exception as e:
            self.uuid_to_jobDetails[job_id].set_error(str(e))
        return job_id

    def __save_file_to_video_provider_task(self, job_id, user: AppUser, file_path: str, file_name_with_ext: str,
                                           file_size: int,
                                           folder_id: str):
        try:
            self.logger.info(f"Job {job_id} uploading {file_name_with_ext} (size {file_size} bytes) to provider")
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
            self.logger.info(f"Job {job_id} done: {file_name} was uploaded successfully on {url_result}")
        except Exception as e:
            serialize_logger.error(str(e))
            self.uuid_to_jobDetails[job_id].set_error(str(e))

    def get_job_error(self, job_id: uuid1) -> str | None:
        return self.uuid_to_jobDetails[job_id].get_error()

    def get_user_for_job(self, job_d: uuid1) -> AppUser:
        return self.uuid_to_jobDetails[job_d].get_user()

    def get_file_from_provider(self,file_id:str,user:AppUser)->uuid1:
        job_id = str(uuid1())
        future= self.workers.submit(self.__get_file_from_provider_task,file_id)
        self.uuid_to_jobDetails[job_id] = JobDetails(future=future,user=user)
        return job_id
    def __get_file_from_provider_task(self,file_id:str)->Tuple[io.BytesIO,str]:
        try:
            job_id = str(uuid1())
            file_to_download:File=File.objects.get(id=file_id)
            file_name = file_to_download.name
            # from the db extract video_url, compressed_file_size, content-type
            compressed_file_size = file_to_download.compressed_size  # in Bytes
            video_url = file_to_download.url
            # use the downloader to download the video from url
            self.logger.info(f"Job {job_id} downloading {file_name} (size {compressed_file_size} bytes) from {video_url}")
            file_path= Mr_EngineManager.process_video_to_file_with_download(video_url, compressed_file_size, job_id)
            in_memory_file = io.BytesIO(open(file_path, "rb").read())
            # os.remove(file_path)
            return in_memory_file,file_name
        except Exception as e:
            deserialize_logger.error(str(e))
            self.uuid_to_jobDetails[job_id].set_error(str(e))

    def get_download_item_bytes_name(self, uuid) -> Tuple[str, int] | str:
        future = self.uuid_to_jobDetails[uuid].future
        results = future.result()
        del self.uuid_to_jobDetails[uuid]
        # Tracker.delete(uuid)
        return results
    def is_processing_done(self, job_id) -> bool:
        future = self.uuid_to_jobDetails[job_id].future
        if future is not None:
            return future.done()
        raise KeyError(f"job_id {job_id} not found")






class JobDetails:
    def __init__(self, user: AppUser=None, future: Future = None):
        self.error: str = None
        self.user: AppUser = user
        self.future: Future = future
        self.uuid_to_error: Dict[uuid1, str] = {}

    def get_error(self):
        return self.error

    def get_user(self):
        return self.user
    def get_future(self):
        return self.future
    def set_error(self, error: str):
        self.error = error


file_controller = FileController()
