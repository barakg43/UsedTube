from django.http import JsonResponse
from rest_framework.views import APIView
from account.models import AppUser
from files.models import File
from sharing.models import SharedItem
from utils import get_user_object
# Create your views here.

class Validate(APIView):
    
    def get(self, request, email: str, node_id: str):
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
            
            # check if the user has already been shared with 
            # using the shared item model
            # if yes return 406
            try:
                file_item = File.objects.get(node_id=node_id)
                SharedItem.objects.get(file_item=file_item, shared_with=target_user)
                return JsonResponse({"error": "User already shared with"}, status=406)
            
            except SharedItem.DoesNotExist:
                SharedItem.objects.create(file_item=file_item, shared_with=target_user)
                return JsonResponse({"message": f"Successfully shared with {target_user.get_full_name()}"}, status=200)
            
            

        except AppUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=406)
