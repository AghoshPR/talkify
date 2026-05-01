from django.db import models
from django.conf import settings
from rooms.models import Room


User = settings.AUTH_USER_MODEL

class Message(models.Model):

    room = models.ForeignKey(Room,on_delete=models.CASCADE,related_name="messages")
    sender = models.ForeignKey(User,on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} - {self.room}"
