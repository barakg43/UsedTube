from google_auth_oauthlib.flow import InstalledAppFlow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google.auth.transport.requests import Request
from engine.constants import YOUTUBE_TOKEN, YOUTUBE_CREDENTIALS
from uuid import uuid4
import os

# Paths to your files
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

class Uploader:
    def __init__(self):
        self.credentials = self.__get_credentials()
        self.youtube = build('youtube', 'v3', credentials=self.credentials)

    def __get_credentials(self):
        credentials = None
        if os.path.exists(YOUTUBE_TOKEN):
            credentials = Credentials.from_authorized_user_file(YOUTUBE_TOKEN, SCOPES)
        
        if not credentials or not credentials.valid:
            if credentials and credentials.expired and credentials.refresh_token:
                credentials.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(YOUTUBE_CREDENTIALS, SCOPES)
                credentials = flow.run_local_server(port=0)
                with open(YOUTUBE_TOKEN, 'w') as token:
                    token.write(credentials.to_json())
        
        return credentials

    def upload_video(self, video_path: str):
        request = self.youtube.videos().insert(
            part='snippet,status',
            body=self.__request_body(),
            media_body=MediaFileUpload(video_path, resumable=False)
        )
        response = request.execute()
        return response['id']

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
