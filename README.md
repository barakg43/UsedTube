# How To Deploy Locally:

please note that there exists a script which launches vscode for both front and back, and also launched postgres on a container, assuming you have docker desktop.
look for open-code-projects.bat in the root folder

## Server

#### 1. place a long video (approx 1 hour) in `backend\server\engine\artifacts\cover_videos` , name it `cover-video.mp4` exactly.

#### 2. create a python venv in `backend\`:
`$ ~\backend> python -m venv .venv` 

#### 3. activate venv:
`$ ~\backend> .venv\Scripts\activate.bat` 

#### 4.install dependencies from requirements.txt
`$ ~\backend> pip install -r .\requirements.txt`

#### 5. make sure you have postgres db running on port 5432, can use docker and `backend\run-postgres.bat` script to launch containerized db

#### 6. create .env.local file and place it in `backend\server`:
```
DEVELOPMENT_MODE=
SECRET_KEY=
DEBUG=
DOMAIN='localhost:3000'
AUTH_COOKIE_SECURE='True'
DAILYMOTION_API_KEY=
DAILYMOTION_API_SECRET=
DAILYMOTION_USERNAME=
DAILYMOTION_PASSWORD=
```
#### 7. run django migrations in activated venv:
```
$> python server\manage.py makemigrations
$> python server\manage.py migrate
```

#### 8. you are ready to go, execute following command to run the server (in activated venv):
`$> python server\manage.py runserver`


## Client

#### 1. make sure you have nodeJS installed.

#### 2. install dependencies:
`$ ~/frontend> npm i`

#### 3. run FE server:
`$ ~/frontend> npm run dev`

Characterization:
https://drive.google.com/file/d/1iOTetSaOxWOfx-bEFAp5SqA-q40O99FG/view?usp=drive_link

