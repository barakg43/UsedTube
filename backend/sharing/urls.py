from django.urls import include
from django.urls import path

from .views import *

#
urlpatterns = [
    path('validate/<str:email>', Validate.as_view()),
]
