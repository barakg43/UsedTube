from django.http import JsonResponse
from rest_framework.views import APIView
from account.models import AppUser
from files.models import File
from sharing.models import SharedItem
from utils import get_user_object


class Validate(APIView):
    
    def get(self, request, email: str, node_id: str):
        try: 
            requesting_user = get_user_object(request)
            target_user = AppUser.objects.get(email=email)
            if requesting_user.email == target_user.email:
                return JsonResponse({"error": "You cannot share with yourself"}, status=406)
            
            try:
                file_item = File.objects.get(node_id=node_id)
                SharedItem.objects.get(file_item=file_item, shared_with=target_user)
                return JsonResponse({"error": "User already shared with"}, status=406)
            
            except SharedItem.DoesNotExist:
                SharedItem.objects.create(file_item=file_item, shared_with=target_user)
                return JsonResponse({"message": f"Successfully shared with {target_user.get_full_name()}"}, status=200)
            
            

        except AppUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=406)


class SharedItemsView(APIView):
    def get(self, request):
        user = get_user_object(request)
        shared_items = user.shared_items.all()
        pass