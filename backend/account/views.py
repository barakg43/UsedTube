from django.http import HttpRequest
from django.views import View


# Create your views here.

class register(View):
    def post(self, request:HttpRequest):
        pass

    def delete(self, request: HttpRequest):
        pass


class login(View):
    def post(self,  request:HttpRequest):
        pass


class logout(View):
    def post(self, request:HttpRequest):
        pass
