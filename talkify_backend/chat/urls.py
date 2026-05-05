# chat/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('/home', views.chat_home, name='chat-home'),
]