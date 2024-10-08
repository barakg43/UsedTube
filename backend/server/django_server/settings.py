"""
Django settings for django_server project.

Generated by 'server-admin startproject' using Django 4.1.13.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""
import os
from os import path, getenv
from pathlib import Path

import dotenv

# from django.core.management.utils import get_random_secret_key

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
SITE_NAME = 'Full Auth'
dotenv_path = BASE_DIR / '.env.local'
if path.isfile(dotenv_path):
    dotenv.load_dotenv(dotenv_path)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/
# get_random_secret_key()
# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = getenv("DJANGO_SECRET_KEY", "asxaaxasadsad")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = getenv("DJANGO_ALLOWED_HOSTS", "127.0.0.1,localhost").split(",")

APPEND_SLASH = False

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'django_extensions',
    'rest_framework',
    # "rest_framework_simplejwt",
    # 'rest_framework.authtoken',
    'files',
    'account',
    'sharing',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.common.CommonMiddleware',
    'django_server.middleware.ResponseLoggingMiddleware',
]

ROOT_URLCONF = 'django_server.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'django_server.wsgi.application'

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases
db_host = os.environ.get('ENV_MODE') == "production" and os.environ.get('DB_HOST') or "localhost"

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'HOST': db_host,
        'PORT': os.environ.get('DB_PORT') or '5432',
        'NAME': os.environ.get('DB_NAME') or 'postgres',
        'USER': os.environ.get('DB_USER') or 'postgres',
        'PASSWORD': os.environ.get('DB_PASSWORD') or 'postgres',
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django.request': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': False,
        },
    },
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'account.authentication.CustomJWTAuthentication',
        'account.authentication.CustomJWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
DJOSER = {
    'PASSWORD_RESET_CONFIRM_URL': '#/password/reset/confirm/{uid}/{token}',
    # 'USERNAME_RESET_CONFIRM_URL': '#/username/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': '#/activation/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,
    # 'SERIALIZERS': {},
    "TOKEN_MODLE": None
}

CORS_ALLOWED_ORIGINS = getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")
CORS_ALLOW_CREDENTIALS = True
AUTH_USER_MODEL = 'account.AppUser'

AUTH_COOKIE_KEY = "access"
AUTH_REFRESH_KEY = "refresh"
AUTH_COOKIE_ACCESS_MAX_AGE = 60 * 5
AUTH_COOKIE_REFRESH_MAX_AGE = 60 * 60 * 24
AUTH_COOKIE_SECURE = getenv("AUTH_COOKIE_SECURE", "True") == "True"
AUTH_COOKIE_HTTP_ONLY = True
AUTH_COOKIE_PATH = "/"
AUTH_COOKIE_SAMESITE = "None"  # restrict to same site frontend backend-disable

# # # HTTPS settings
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
# SECURE_SSL_REDIRECT = True
# SECURE_HSTS_SECONDS = 31536000  # 1 year
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
#
