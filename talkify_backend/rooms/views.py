from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Room

class RoomListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):

        rooms = Room.objects.all().values()
        return Response(rooms)


    def post(self,request):

        name=request.data.get("name")

        room = Room.objects.create(
            name=name,
            description = request.data.get("description"),
            created_by=request.user
        )

        return Response({
            "id":room.id,
            "name":room.name,
            "description":room.description
        })
    
class RoomDetailView(APIView):

    def get(self,request,room_id):

        room  = Room.objects.get(id=room_id)

        return Response({
            "id":room.id,
            "name":room.name,
            "description":room.description
        })
    