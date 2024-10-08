from django.urls import include
from django.urls import path

from .views import *

#
urlpatterns = [
    path('register', Register.as_view()),
    path('', include('djoser.urls')),

    path("auth/jwt/create", CustomTokenObtainPairView.as_view()),
    path("auth/jwt/refresh", CustomTokenRefreshView.as_view()),
    path("auth/jwt/verify", CustomTokenVerifyView.as_view()),

    path('logout', LogoutView.as_view(), name='logout'),
    path('validate', Validate.as_view()),
]
