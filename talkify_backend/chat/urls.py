# chat/urls.py

from django.urls import path
from .views import RoomMessagesView

urlpatterns = [
    path("messages/<int:room_id>/",RoomMessagesView.as_view())
]