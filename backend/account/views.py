import datetime
from uuid import uuid4
from django.http import HttpRequest, JsonResponse
from django.views import View
from djoser.social.views import ProviderAuthView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView, TokenRefreshView
from account.models import APIProvider, AppUser
from constants import ERROR, MESSAGE
from django_server import settings
from django_server.settings import AUTH_REFRESH_KEY, AUTH_COOKIE_KEY
from files.models import Folder
from utils import already_exists, get_user_object
from utils import convert_body_json_to_dict


# Create your views here.

class Register(View):
    permission_classes = ([])
    def __additional_registration_actions(self, user: AppUser):
        # set used space to 0

        # create root folder
        now = datetime.datetime.now()
        root_folder = Folder.objects.create(id=uuid4(), name='My Drive', parent=None, owner=user, created_at=now,
                                            updated_at=now)
        # create user details
        user.root_folder = root_folder
        user.save()

    def post(self, request: HttpRequest):
        body_dict = convert_body_json_to_dict(request)
        # Get data from request
        username = body_dict.get('username')
        password = body_dict.get('password')
        email = body_dict.get('email')
        
        # add empty cases handle
        # Check if username or email already exists
        if AppUser.objects.filter(username=username).exists():
            return JsonResponse({ERROR: already_exists('Username')}, status=400)
        if AppUser.objects.filter(email=email).exists():
            return JsonResponse({ERROR: already_exists('Email')}, status=400)

        # Create user
        user = AppUser.objects.create_user(username=username, email=email, password=password,
                                        first_name=body_dict.get('firstName'),
                                        last_name=body_dict.get('lastName'),storage_usage=0)

        providers_to_keys = body_dict.get('providers')
        for provider in providers_to_keys:
            APIProvider.objects.create(provider_name=provider, api_key=providers_to_keys[provider], user=user)
            
        self.__additional_registration_actions(user)

        return JsonResponse({MESSAGE: 'User registered successfully'})

    def delete(self, request: HttpRequest):
        # Get current user
        user =get_user_object(request)

        if not user.is_authenticated:
            return JsonResponse({ERROR: 'User is not authenticated'}, status=401)

        user.delete()

        return JsonResponse({'message': 'User account deleted successfully'})
    

class Validate(View):
    def post(self, request: HttpRequest):
        body = convert_body_json_to_dict(request)
        field, value = next(iter(body.items()))
        match field:
            case 'username':
                if AppUser.objects.filter(username=value).exists():
                    return JsonResponse({ERROR: already_exists('Username')}, status=400)
            case 'email':
                if AppUser.objects.filter(email=value).exists():
                    return JsonResponse({ERROR: already_exists('Email')}, status=400)
            case _:
                return JsonResponse({ERROR: 'Invalid field'}, status=400)
        return JsonResponse({MESSAGE: 'Field is valid'})


class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get(AUTH_COOKIE_KEY)
            refresh_token = response.data.get(AUTH_REFRESH_KEY)

            response.set_cookie(
                AUTH_COOKIE_KEY,
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                AUTH_REFRESH_KEY,
                refresh_token,
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get(AUTH_COOKIE_KEY)
            refresh_token = response.data.get(AUTH_REFRESH_KEY)

            response.set_cookie(
                AUTH_COOKIE_KEY,
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )
            response.set_cookie(
                AUTH_REFRESH_KEY,
                refresh_token,
                max_age=settings.AUTH_COOKIE_REFRESH_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get(AUTH_REFRESH_KEY)

        if refresh_token:
            request.data[AUTH_REFRESH_KEY] = refresh_token

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get(AUTH_COOKIE_KEY)

            response.set_cookie(
                AUTH_COOKIE_KEY,
                access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                secure=settings.AUTH_COOKIE_SECURE,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE
            )

        return response


class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get(AUTH_COOKIE_KEY)

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    permission_classes = ([])
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(AUTH_COOKIE_KEY)
        response.delete_cookie(AUTH_REFRESH_KEY)

        return response

class APIProviderView(APIView):
    def get(self, request: HttpRequest, provider_name: str):
        try:
            user = get_user_object(request)
            provider = APIProvider.objects.get(provider_name=provider_name, user=user)
        except APIProvider.DoesNotExist:
            return JsonResponse({ERROR: 'Provider not found'}, status=404)
        # WHY API KEY NOT SENT?
        print(provider.api_key)
        return JsonResponse({'provider': provider.provider_name, 'key': provider.api_key}, status=200)