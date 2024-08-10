from django.urls import include
from django.urls import path

from .views import *

#
urlpatterns = [
    path('create/<str:email>&<str:node_id>', Validate.as_view()),
    path('', SharedItemsView.as_view()),
]
