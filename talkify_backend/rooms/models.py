from django.db import models
from django.conf import settings


User = settings.AUTH_USER_MODEL

class Room(models.Model):

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User,on_delete=models.CASCADE,related_name="created_rooms")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name