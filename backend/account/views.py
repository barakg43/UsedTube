import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpRequest, JsonResponse
from django.views import View
from constants import ERROR, MESSAGE
from utils import  already_exists
from files.models import UsedSpace, Folder


# Create your views here.

class Register(View):
    def __additional_registration_actions(self, user: User):
        # set used space to 0
        UsedSpace.objects.create(user=user, value=0)
        # create root folder
        now = datetime.datetime.now()
        Folder.objects.create(name='root', parent=None, owner=user, created_at=now, updated_at=now)
        
    def post(self, request:HttpRequest):
        # Get data from request
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({ERROR: already_exists('Username')}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({ERROR: already_exists('Email')}, status=400)

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)

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
    def post(self,  request:HttpRequest):
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Authenticate user
        if request.user.is_authenticated:
            return JsonResponse({'error': 'Already logged in'}, status=403)
        user = authenticate(request, username=username, password=password)

        # Check if authentication was successful
        if user is not None:
            # Login user
            login(request, user)
            return JsonResponse({MESSAGE: 'Login successful'})
        else:
            return JsonResponse({ERROR: 'Invalid credentials'}, status=401)


class Logout(View):
    def post(self, request:HttpRequest):
        # Check if user is authenticated
        if request.user.is_authenticated:
            # Log out user
            logout(request)
            return JsonResponse({MESSAGE: 'Logout successful'})
        else:
            return JsonResponse({ERROR: 'User is not authenticated'}, status=401)
