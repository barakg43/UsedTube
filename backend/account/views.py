import datetime
from uuid import uuid4

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpRequest, JsonResponse
from django.views import View
from djoser.social.views import ProviderAuthView
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenVerifyView, TokenRefreshView

from constants import ERROR, MESSAGE
from django_server import settings
from django_server.settings import AUTH_REFRESH_KEY, AUTH_ACCESS_KEY
from files.models import UserDetails, Folder
from utils import already_exists
from utils import convert_body_json_to_dict


# Create your views here.

class Register(View):
    permission_classes = [AllowAny]
    def __additional_registration_actions(self, user: User):
        # set used space to 0

        # create root folder
        now = datetime.datetime.now()
        root_folder = Folder.objects.create(id=uuid4(), name='My Drive', parent=None, owner=user, created_at=now,
                                            updated_at=now)
        UserDetails.objects.create(user=user, storage_usage=0, root_folder=root_folder)

    def post(self, request: HttpRequest):
        body_dict = convert_body_json_to_dict(request)
        # Get data from request
        username = body_dict.get('username')
        password = body_dict.get('password')
        email = body_dict.get('email')
        # add empty cases handle
        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({ERROR: already_exists('Username')}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({ERROR: already_exists('Email')}, status=400)

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password,
                                        first_name=body_dict.get('firstName'),
                                        last_name=body_dict.get('lastName'))

        self.__additional_registration_actions(user)

        return JsonResponse({MESSAGE: 'User registered successfully'})

    def delete(self, request: HttpRequest):
        # Get current user
        user = request.user

        if not user.is_authenticated:
            return JsonResponse({ERROR: 'User is not authenticated'}, status=401)

        user.delete()

        return JsonResponse({'message': 'User account deleted successfully'})

# @deprecated-using new logout jwt
# class Login(View):
#     pass
#
#     def post(self, request: HttpRequest):
#         body_dict = convert_body_json_to_dict(request)
#         username = body_dict.get('username')
#         password = body_dict.get('password')
#
#         # Authenticate user
#         if request.user.is_authenticated:
#             return JsonResponse({'error': 'Already logged in'}, status=403)
#         user = authenticate(request, username=username, password=password)
#
#         # Check if authentication was successful
#         if user is not None:
#             # Login user
#             login(request, user)
#             # get user root folder and its children
#             # root_folder = UserDetails.objects.get(user=user).root_folder
#             # folder_subitems = select_folder_subitems(user, root_folder.id)
#             return JsonResponse({'userId': user.id, })
#         else:
#             return JsonResponse({ERROR: 'Invalid credentials'}, status=401)

# @deprecated-using new logout jwt
# class Logout(View):
#     def post(self, request: HttpRequest):
#         # Check if user is authenticated
#         if request.user.is_authenticated:
#             # Log out user
#             logout(request)
#             return JsonResponse({MESSAGE: 'Logout successful'})
#         else:
#             return JsonResponse({ERROR: 'User is not authenticated'}, status=401)


# class Logout(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         try:
#             request.user.auth_token.delete()
#             return Response(status=status.HTTP_200_OK)
#         except (AttributeError, Token.DoesNotExist):
#             return Response(status=status.HTTP_400_BAD_REQUEST)

class Validate(View):
    permission_classes = [AllowAny]
    def post(self, request: HttpRequest):
        body = convert_body_json_to_dict(request)
        field, value = next(iter(body.items()))
        match field:
            case 'username':
                if User.objects.filter(username=value).exists():
                    return JsonResponse({ERROR: already_exists('Username')}, status=400)
            case 'email':
                if User.objects.filter(email=value).exists():
                    return JsonResponse({ERROR: already_exists('Email')}, status=400)
            case _:
                return JsonResponse({ERROR: 'Invalid field'}, status=400)
        return JsonResponse({MESSAGE: 'Field is valid'})


class CustomProviderAuthView(ProviderAuthView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 201:
            access_token = response.data.get(AUTH_ACCESS_KEY)
            refresh_token = response.data.get(AUTH_REFRESH_KEY)

            response.set_cookie(
                AUTH_ACCESS_KEY,
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
            access_token = response.data.get(AUTH_ACCESS_KEY)
            refresh_token = response.data.get(AUTH_REFRESH_KEY)

            response.set_cookie(
                AUTH_ACCESS_KEY,
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
            access_token = response.data.get(AUTH_ACCESS_KEY)

            response.set_cookie(
                AUTH_ACCESS_KEY,
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
        access_token = request.COOKIES.get(AUTH_ACCESS_KEY)

        if access_token:
            request.data['token'] = access_token

        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        response = Response(status=status.HTTP_204_NO_CONTENT)
        response.delete_cookie(AUTH_ACCESS_KEY)
        response.delete_cookie(AUTH_REFRESH_KEY)

        return response
