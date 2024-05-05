import json

from django.http import HttpRequest


def already_exists(what: str) -> str:
    return f"{what} already exists"


def convert_body_json_to_dict(request: HttpRequest) -> dict:
    body_unicode = request.body.decode('utf-8')
    body_dict = json.loads(body_unicode)
    return body_dict
