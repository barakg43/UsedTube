import datetime

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpRequest, JsonResponse
from django.views import View
from constants import ERROR, MESSAGE
from files.models import UserDetails, Folder
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from utils import already_exists
from utils import convert_body_json_to_dict
from uuid import uuid4

# Create your views here.

class Register(View):
    def __additional_registration_actions(self, user: User):
        # set used space to 0

        # create root folder
        now = datetime.datetime.now()
        root_folder = Folder.objects.create(id=uuid4(), name='My Drive', parent=None, owner=user, created_at=now, updated_at=now)
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
        user = User.objects.create_user(username=username, email=email, password=password, first_name=body_dict.get('firstName'),
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


class Login(View):
    pass
    def post(self, request: HttpRequest):
        body_dict = convert_body_json_to_dict(request)
        username = body_dict.get('username')
        password = body_dict.get('password')
        # Authenticate user
        if request.user.is_authenticated:
            return JsonResponse({'error': 'Already logged in'}, status=403)
        user = authenticate(request, username=username, password=password)

        # Check if authentication was successful
        if user is not None:
            # Login user
            login(request, user)
            # get user root folder and its children
            # root_folder = UserDetails.objects.get(user=user).root_folder
            # folder_subitems = select_folder_subitems(user, root_folder.id)
            return JsonResponse({MESSAGE: 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({ERROR: 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class Logout(View):
    def post(self, request: HttpRequest):
        # Check if user is authenticated
        if request.user.is_authenticated:
            # Log out user
            logout(request)
            return JsonResponse({MESSAGE: 'Logout successful'})
        else:
            return JsonResponse({ERROR: 'User is not authenticated'}, status=401)

# class Logout(APIView):
#     permission_classes = [IsAuthenticated]
#
#     def post(self, request):
#         try:
#             request.user.auth_token.delete()
#             return Response(status=status.HTTP_200_OK)
#         except (AttributeError, Token.DoesNotExist):
#             return Response(status=status.HTTP_400_BAD_REQUEST)

class Validate(View):
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
       