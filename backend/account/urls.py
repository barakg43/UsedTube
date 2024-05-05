from django.urls import path

from .views import *

urlpatterns = [
    path('register', Register.as_view()),
    path('login', Login.as_view()),
    path('logout', Logout.as_view())
]
