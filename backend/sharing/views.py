import json
from typing import List
from django.http import JsonResponse
from rest_framework.views import APIView
from account.models import AppUser
from django_server.model_utils import beautify_timestamps, set_owner_name
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
                file_item = File.objects.get(id=node_id)
                SharedItem.objects.get(file_item=file_item, shared_with=target_user)
                return JsonResponse({"error": "User already shared with"}, status=406)
            
            except SharedItem.DoesNotExist:
                SharedItem.objects.create(file_item=file_item, shared_with=target_user)
                return JsonResponse({"message": f"Successfully shared with {target_user.get_full_name()}"}, status=200)
            
            

        except AppUser.DoesNotExist:
            return JsonResponse({"error": "User not found"}, status=406)
        
        except:
            return JsonResponse({"error": "An error occurred"}, status=500)


class SharedItemsView(APIView):
    def get(self, request):
        user = get_user_object(request)
        shared_items = user.shared_items.all()
       
        if len(shared_items) == 0:
            return JsonResponse({}, status=200)
        
        # get File objects from shared_items
        ids: List[File] = [item.file_item.id for item in shared_items]
        files_list = list(File.objects.filter(id__in=ids).values("id", "name", "extension", "size", "folder", "created_at", "updated_at", "owner"))
        files_list = list(map(beautify_timestamps, files_list))
        files_list = list(map(set_owner_name, files_list))
        return JsonResponse({'files': files_list}, status=200)
    
    def delete(self, request):
        user = get_user_object(request)
        file_id = json.loads(request.body).get("nodeId")
        try:
            file = File.objects.get(id=file_id)
            shared_item = SharedItem.objects.get(file_item=file, shared_with=user)
            shared_item.delete()
            return JsonResponse({"message": "Successfully unshared"}, status=200)
        except File.DoesNotExist:
            return JsonResponse({"error": "File not found"}, status=404)
        except SharedItem.DoesNotExist:
            return JsonResponse({"error": "File not shared with user"}, status=404)
        except:
            return JsonResponse({"error": "An error occurred"}, status=500)