from django.http import JsonResponse
from rest_framework.views import APIView
from account.models import AppUser
from utils import get_user_object
# Create your views here.

class Validate(APIView):
    
    def get(self, request, email: str):
        # check if email exists in the database
        # if not return 406
        # if yes, check if email is the email of the requesting user
        # if yes return 406
        # if no return 200
        try: 
            requesting_user = get_user_object(request)
            target_user = AppUser.objects.get(email=email)
            if requesting_user.email == target_user.email:
                return JsonResponse({"error": "You cannot share with yourself"}, status=406)
            
            return JsonResponse({"message": f"Successfully shared with {target_user.get_full_name()}"}, status=200)
        
        except AppUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=406)
