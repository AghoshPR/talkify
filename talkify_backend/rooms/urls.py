# rooms/urls.py

from django.urls import path
from .views import RoomListCreateView

urlpatterns = [
    # example route
    path('', RoomListCreateView.as_view(), name='rooms-home'),
]