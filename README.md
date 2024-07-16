# How To Deploy:

please note that there exists a script which launches vscode for both front and back, and also launched postgres on a container, assuming you have docker desktop.
look for open-code-projects.bat in the root folder

## Server

#### 1. clone the repo.

#### 2 . download a long video (approx 2hrs) and place it in /backend\artifacts\cover_videos , name it "cover-video.mp4" exactly.

#### 3. navigate to backend dir, create python virtual env, and install dependencies from requirements.txt
```
$> python -m venv .venv
$> pip install -r .\requirements.txt
```

#### 4. make sure you have postgres db running, can use docker and backend/run-postgres.bat script to launch containerized db


#### 5. run django migrations:
```
$> python manage.py makemigrations
$> python manage.py migrate
```

#### create .env.local file
this file should be placed in backend folder and contain the following key with the values which you would set
DEVELOPMENT_MODE=
SECRET_KEY = 
DEBUG=
DOMAIN='localhost:3000'
AUTH_COOKIE_SECURE='True'
DAILYMOTION_API_KEY=
DAILYMOTION_API_SECRET=
DAILYMOTION_USERNAME=
DAILYMOTION_PASSWORD=


#### 7. you are ready to go!
```
$> python manage.py runserver
```
## Client

#### 1. make sure you have node installed.

#### 2. install dependencies:
```
$> npm i
```

UsedTube
Characterization:
https://drive.google.com/file/d/1iOTetSaOxWOfx-bEFAp5SqA-q40O99FG/view?usp=drive_link

