import io
import os
from concurrent.futures import ThreadPoolExecutor, Future
from typing import Dict, Tuple, Callable
from uuid import uuid1

from django.core.files.uploadedfile import InMemoryUploadedFile

from account.models import AppUser
from engine.constants import ITEMS_READY_FOR_PROCESSING
from engine.downloader.DailymotionDownloader import DailymotionDownloader
from engine.downloader.definition import Downloader
from engine.manager import Mr_EngineManager
from engine.serialization.serializer import deserialize_logger, serialize_logger
from files.models import File
from files.progress_tracker import ProgressTracker


class FileController:

    def __init__(self):
        self.workers = ThreadPoolExecutor(20)
        self.engine_manger = Mr_EngineManager
        self.uuid_to_jobDetails: Dict[uuid1, JobDetails] = {}
        self.logger = serialize_logger
        # self.uuid_to_future: Dict[uuid1, Future] = {}
        # self.uuid_to_progress: Dict[uuid1, float] = {}

    def save_file_to_video_provider_async(self, user: AppUser, uploaded_file: InMemoryUploadedFile, folder_id: str):
        job_id = str(uuid1())
        try:
            self.uuid_to_jobDetails[job_id] = JobDetails(user=user, phase_weights_array=[0.30, 0.20, 0.49, 0.01])
            file_path = os.path.join(ITEMS_READY_FOR_PROCESSING, f"{job_id}_{uploaded_file.name}")

            with open(file_path, "wb") as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            progress_tracker = self.uuid_to_jobDetails[job_id].progress_tracker_callback()
            self.workers.submit(self.__save_file_to_video_provider_task,
                                job_id,
                                user,
                                file_path,
                                uploaded_file.name,
                                uploaded_file.size,
                                folder_id, progress_tracker)
        except Exception as e:
            self.uuid_to_jobDetails[job_id].set_error(str(e))
        return job_id

    def __save_file_to_video_provider_task(self, job_id,
                                           user: AppUser,
                                           file_path: str,
                                           file_name_with_ext: str,
                                           file_size: int,
                                           folder_id: str,
                                           progress_tracker: Callable[[int, float], None] = None):

        try:
            self.logger.info(f"Job {job_id} uploading {file_name_with_ext} (size {file_size} bytes) to provider")
            url_result, compressed_size = self.engine_manger.process_file_to_video_with_upload(file_path, job_id,
                                                                                               progress_tracker)
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
            progress_tracker(4, 1)
        except Exception as e:
            serialize_logger.error(str(e))
            self.uuid_to_jobDetails[job_id].set_error(str(e))

    def get_job_error(self, job_id: uuid1) -> str | None:
        return self.uuid_to_jobDetails[job_id].get_error()

    def get_user_for_job(self, job_d: uuid1) -> AppUser:
        return self.uuid_to_jobDetails[job_d].get_user()

    def get_file_from_provider_async(self, file_id: str, user: AppUser) -> uuid1:
        job_id = str(uuid1())
        future = self.workers.submit(self.__get_file_from_provider_task, file_id, job_id)
        self.uuid_to_jobDetails[job_id] = JobDetails(future=future, user=user,phase_weights_array=[0.49,0.20,0.30,0.01])
        return job_id
    def get_job_progress(self, job_id: uuid1) -> float:
        return self.uuid_to_jobDetails[job_id].get_progress()
    def __get_file_from_provider_task(self, file_id: str, job_id: uuid1) -> Tuple[io.BytesIO, str]:
        try:

            file_to_download: File = File.objects.get(id=file_id)
            file_name = file_to_download.name
            # from the db extract video_url, compressed_file_size, content-type
            compressed_file_size = file_to_download.compressed_size  # in Bytes
            video_url = file_to_download.url
            # use the downloader to download the video from url
            progress_tracker = self.uuid_to_jobDetails[job_id].progress_tracker_callback()
            self.logger.info(
                f"Job {job_id} downloading {file_name} (size {compressed_file_size} bytes) from {video_url}")
            file_path = Mr_EngineManager.process_video_to_file_with_download(video_url, compressed_file_size, job_id,
                                                                             progress_tracker)
            file_io = open(file_path, "rb")
            in_memory_file = io.BytesIO(file_io.read())
            file_io.flush()
            file_io.close()
            progress_tracker(4, 1)
            # os.remove(file_path)
            return in_memory_file, file_name
        except Exception as e:
            deserialize_logger.error(str(e))
            self.uuid_to_jobDetails[job_id].set_error(str(e))

    def cancel_action(self, uuid):
        future = self.uuid_to_jobDetails[uuid].get_future()
        future.cancel()
        del self.uuid_to_jobDetails[uuid]

    def get_download_item_bytes_name(self, uuid) -> Tuple[io.BytesIO, int]:
        future = self.uuid_to_jobDetails[uuid].future
        results = future.result()
        self.uuid_to_jobDetails[uuid].progress_tracker.update_progress(4, 1)
        self.remove_job(uuid)
        # Tracker.delete(uuid)
        return results

    def remove_job(self, job_id: uuid1):
        del self.uuid_to_jobDetails[job_id]

    def is_processing_done(self, job_id) -> bool:
        future = self.uuid_to_jobDetails[job_id].future
        if future is not None:
            return future.done() and self.uuid_to_jobDetails[job_id].get_progress() == 1
        raise KeyError(f"job_id {job_id} not found")


class JobDetails:
    def __init__(self, phase_weights_array: list[float], user: AppUser = None, future: Future = None):
        self.error: str | None = None
        self.user: AppUser = user
        self.future: Future = future
        self.progress_tracker: ProgressTracker = ProgressTracker(phase_weights_array)
        self.uuid_to_error: Dict[uuid1, str] = {}

    def get_error(self):
        return self.error

    def get_user(self):
        return self.user

    def get_future(self):
        return self.future

    def set_error(self, error: str):
        self.error = error

    def progress_tracker_callback(self) -> Callable[[int, float], None]:
        return self.progress_tracker.update_progress

    def get_progress(self):
        return self.progress_tracker.get_total_progress()


file_controller = FileController()
