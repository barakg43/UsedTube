import json
from os import getenv, path

import dailymotion
import dotenv
import requests

from django_server.settings import BASE_DIR
from engine.uploader.definition import Uploader


class DailymotionUploader(Uploader):

    def __init__(self):
        super().__init__()
        self.client = dailymotion.Dailymotion()

        # Load .env.local file temporarily from here-only for testing...
        dotenv_path = BASE_DIR / '.env.local'
        if path.isfile(dotenv_path):
            dotenv.load_dotenv(dotenv_path)

        self.api_key = getenv("DAILYMOTION_API_KEY")
        self.api_secret = getenv("DAILYMOTION_API_SECRET")
        self.username = getenv("DAILYMOTION_USERNAME")
        self.password = getenv("DAILYMOTION_PASSWORD")
        self.base_url_api = "https://partner.api.dailymotion.com/rest/"
        self.auth_url = "https://partner.api.dailymotion.com/oauth/v1/token"
        self.videos_url_template = "https://www.dailymotion.com/video/{}"
        self.authorization_header =None
        self.body = {
            'grant_type': 'client_credentials',
            'client_id': self.api_key,
            'client_secret': self.api_secret,
            'scope': 'manage_videos upload_videos read_videos edit_videos delete_videos'
        }
        self.headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }


    def upload(self, file_path: str):
        self.client.set_grant_type('password',
                                   api_key=self.api_key,
                                   api_secret=self.api_secret,
                                   scope=['manage_videos'],info={"username":self.username,"password":self.password})
        url = self.client.upload(file_path)
        pub_url= self.client.post(
        "/me/videos",
        {
            "url": url,
            "title": "MyTitle",
            "published": "true",
            "channel": "creation",
            "is_created_for_kids": "false",
        })
        return self.videos_url_template.format(pub_url['id'])

    # Sending the video file to the upload url obtained in the previous function




    # def __get_upload_url(self):
    #     '''
    #     Getting an upload url be able to store your video file
    #     '''
    #     response = requests.get(url=self.base_url_api + "file/upload",
    #                             headers=self.authorization_header)
    #
    #     if response.status_code != 200 or not 'upload_url' in response.json():
    #         raise Exception('Invalid upload url response')
    #
    #     return response.json()
    # def __upload_video_file_to_platform(self,uploaded_url:str,file_path:str):
    #     '''
    #     Uploading your video file to the platform
    #     '''
    #
    #     files = {'file': open(
    #         file_path, 'rb')}
    #     # m = MultipartEncoder(fields={'file': (os.path.basename(file_path), open(file_path, 'rb'))})
    #     # headers['Content-Type'] = m.content_type
    #     response = requests.post(uploaded_url,
    #                              files=files,
    #                              headers=self.authorization_header)
    #
    #     if response.status_code != 200 or not 'url' in response.json():
    #         raise Exception('Invalid upload video file response')
    #     files['file'].close()
    #     return response.json()['url']
    #
    # # Now that your video file is uploaded, you can publish your video by setting it's mandatory fields
    # def __publish_uploaded_video(self,uploaded_url:str):
    #     '''
    #     Now that your video has been uploaded, you can publish it to make it visible
    #     '''
    #
    #     publish_url = self.base_url_api+"me/videos"
    #     response = requests.post(publish_url, data={
    #         "published": "true",
    #         "url": uploaded_url,
    #         "title": "YourVideoTitle",
    #         'description': 'Your video description',
    #         "channel": "creation",
    #         "is_created_for_kids": "false"
    #     },headers=self.authorization_header)
    #
    #     if response.status_code != 200 or not 'id' in response.json():
    #         raise Exception(response.text)
    #
    #     return response.json()
    #
    # # You can use your client_id and your client_secret generated to retrieve an access token
    # def __set_access_token(self, client_id, client_secret):
    #     '''
    #     Authenticate on the API in order to get an access token
    #     '''
    #
    #
    #     response = requests.post(self.auth_url,
    #                              data={
    #                                  'client_id': client_id,
    #                                  'client_secret': client_secret,
    #                                  'grant_type': 'password',
    #                                  'username': self.username,
    #                                  'password': self.password,
    #                                  'scope': 'manage_videos manage_playlists userinfo'
    #                              },
    #                              headers={
    #                                  'Content-Type': 'application/x-www-form-urlencoded'
    #                              })
    #
    #     if response.status_code != 200 or not 'access_token' in response.json():
    #         raise Exception('Invalid authentication response')
    #     # self.client.set_access_token(response.json()['access_token'])
    #
    #     self.authorization_header = {'Authorization': 'Bearer ' + response.json()['access_token']}