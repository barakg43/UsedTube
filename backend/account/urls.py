from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from .views import *

urlpatterns = [
    path('register', Register.as_view()),
    path('login', obtain_auth_token, name='login'),
    path('logout', Logout.as_view(), name='logout'),
    path('validate', Validate.as_view()),
]
