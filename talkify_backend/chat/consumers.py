import json

from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

from django.contrib.auth import get_user_model

from rooms.models import Room
from .models import Message


User = get_user_model()

room_users = {}


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.room_id = self.scope["url_route"]["kwargs"]["room_id"]

        self.room_group_name = f"chat_{self.room_id}"
        self.username = None

        if self.room_id not in room_users:
            room_users[self.room_id] = set()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if self.username and self.username in room_users.get(self.room_id, set()):
            room_users[self.room_id].remove(self.username)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_list_update",
                    "users": list(room_users[self.room_id])
                }
            )

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):

        data = json.loads(text_data)

        message_type = data.get("type", "chat_message")

        if message_type == "join":

            self.username = data["username"]

            room_users[self.room_id].add(self.username)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "user_list_update",
                    "users": list(room_users[self.room_id])
                }
            )

        elif message_type == "chat_message":

            message = data["message"]

            sender = data["sender"]

            # SAVE MESSAGE
            await self.save_message(sender, message)

            # SEND MESSAGE TO ROOM
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": message,
                    "sender": sender,
                }
            )

    async def chat_message(self, event):

        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
        }))

    async def user_list_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "user_list_update",
            "users": event["users"]
        }))

    @database_sync_to_async
    def save_message(self, sender_username, message):

        user = User.objects.get(username=sender_username)

        room = Room.objects.get(id=self.room_id)

        Message.objects.create(
            room=room,
            sender=user,
            content=message
        )