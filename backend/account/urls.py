from django.urls import include
from django.urls import path

from .views import *

#
urlpatterns = [
    path('register', Register.as_view()),
    path('auth/', include('djoser.urls')),

    path("auth/jwt/create",CustomTokenObtainPairView.as_view()),
    path("auth/jwt/refresh",CustomTokenRefreshView.as_view()),
    path("auth/jwt/verify",CustomTokenVerifyView.as_view()),

    # path('login', Login.as_view(), name='login'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    path('validate', Validate.as_view()),
]
