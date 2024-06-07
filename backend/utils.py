import json


from django.http import HttpRequest

from account.authentication import CustomJWTAuthentication
from account.models import AppUser

jwt_token_auth = CustomJWTAuthentication()
def already_exists(what: str) -> str:
    return f"{what} already exists"
def get_user_object(request: HttpRequest) -> AppUser:
    user, _ = jwt_token_auth.authenticate(request)
    # Folder.objects.filter(owner=User.objects.get(id=user_raw.id))
    # user= User.objects.get(id=user_raw['user_id'])
    return user

def convert_body_json_to_dict(request: HttpRequest) -> dict:
    body_unicode = request.body.decode('utf-8')
    body_dict = json.loads(body_unicode)
    return body_dict

