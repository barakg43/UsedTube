import os
import sys
from threading import Thread
import time
import random
from urllib.request import Request
import httplib2
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
from oauth2client.file import Storage
from oauth2client.tools import run_flow
from oauth2client.client import flow_from_clientsecrets
from uuid import uuid4

# Retry settings
httplib2.RETRIES = 1
MAX_RETRIES = 10
RETRIABLE_EXCEPTIONS = (httplib2.HttpLib2Error)
RETRIABLE_STATUS_CODES = [500, 502, 503, 504]

# OAuth 2.0 scope
YOUTUBE_UPLOAD_SCOPE = "https://www.googleapis.com/auth/youtube.upload"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"
YOUTUBE_TOKEN = 'youtube_token.json'
YOUTUBE_CREDENTIALS = os.path.join(os.path.dirname(__file__),'client_secrets.json')

class YouTubeUploader:
    def __init__(self, uuid, tracker):
        self.credentials = self.__get_credentials()
        self.youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, credentials=self.credentials)
        self.tracker = tracker
        self.uuid = uuid
        self.base_url = "https://www.youtube.com/watch?v="

    def __get_credentials(self):
        credentials = None
        if os.path.exists(YOUTUBE_TOKEN):
            credentials = Credentials.from_authorized_user_file(YOUTUBE_TOKEN, [YOUTUBE_UPLOAD_SCOPE])
        
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(YOUTUBE_CREDENTIALS, [YOUTUBE_UPLOAD_SCOPE])
                credentials = flow.run_local_server(port=0)
                with open(YOUTUBE_TOKEN, 'w') as token:
                    token.write(credentials.to_json())
        
        return credentials

    def upload_video(self, video_path: str):
        request = self.youtube.videos().insert(
            part='snippet,status',
            body=self.__request_body(),
            media_body=MediaFileUpload(video_path, chunksize=-1, resumable=True)
        )
        return Thread(target=self.__resumable_upload, args=(request, os.path.getsize(video_path))).start()

    @staticmethod
    def __request_body():
        return {
            'snippet': {
                'title': f'UsedTube - {uuid4()} - Uploaded Video',
                'description': 'This video was uploaded using the UsedTube API and is for testing purposes only.',
                'tags': ['UsedTube', 'Serialized', 'Video'],
                'categoryId': '22'
            },
            'status': {
                'privacyStatus': 'unlisted'
            }
        }

    def __resumable_upload(self, insert_request, file_size):
        response = None
        error = None
        retry = 0
        while response is None:
            try:
                print("Uploading file...")
                status, response = insert_request.next_chunk()
                if status:
                    self.tracker.set_progress(self.uuid, status.resumable_progress / file_size)
                if response is not None:
                    if 'id' in response:
                        print("Video id '%s' was successfully uploaded." % response['id'])
                        return response['id']
                    else:
                        exit("The upload failed with an unexpected response: %s" % response)
            except HttpError as e:
                if e.resp.status in RETRIABLE_STATUS_CODES:
                    error = "A retriable HTTP error %d occurred:\n%s" % (e.resp.status, e.content)
                else:
                    raise
            except RETRIABLE_EXCEPTIONS as e:
                error = "A retriable error occurred: %s" % e

            if error is not None:
                print(error)
                retry += 1
                if retry > MAX_RETRIES:
                    exit("No longer attempting to retry.")

                max_sleep = 2 ** retry
                sleep_seconds = random.random() * max_sleep
                print(f"Sleeping {sleep_seconds} seconds and then retrying...")
                time.sleep(sleep_seconds)
