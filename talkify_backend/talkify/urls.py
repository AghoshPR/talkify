
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('auth.urls')),
    path('api/rooms/', include('room.urls')),
    path('api/chat/', include('chat.urls')),
    

]
