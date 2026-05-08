# rooms/urls.py

from django.urls import path
from .views import RoomListCreateView,RoomDetailView

urlpatterns = [
    # example route
    path('', RoomListCreateView.as_view(), name='rooms-home'),
    path('<int:room_id>/',RoomDetailView.as_view(),name='room-detail'
    ),
]