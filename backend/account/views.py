from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpRequest, JsonResponse
from django.views import View


# Create your views here.

class Register(View):
    def post(self, request:HttpRequest):
        # Get data from request
        username = request.POST.get('username')
        password = request.POST.get('password')
        email = request.POST.get('email')

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already exists'}, status=400)

        # Create user
        user = User.objects.create_user(username=username, email=email, password=password)

        # Optionally, we may want to send a confirmation email or perform additional actions here

        return JsonResponse({'message': 'User registered successfully'})

    def delete(self, request: HttpRequest):
        # Get current user
        user = request.user

        if not user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)

        user.delete()

        return JsonResponse({'message': 'User account deleted successfully'})


class Login(View):
    def post(self,  request:HttpRequest):
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Authenticate user
        user = authenticate(request, username=username, password=password)

        # Check if authentication was successful
        if user is not None:
            # Login user
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)


class Logout(View):
    def post(self, request:HttpRequest):
        # Check if user is authenticated
        if request.user.is_authenticated:
            # Log out user
            logout(request)
            return JsonResponse({'message': 'Logout successful'})
        else:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)
