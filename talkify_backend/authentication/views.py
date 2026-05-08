from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "User created successfully"}, status=201)
        return Response(serializer.errors,status=400)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():

            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            })

        return Response(serializer.errors, status=400)

# SuperUser
class CreateSuperUserView(APIView):

    authentication_classes = []
    permission_classes = []

    def get(self, request):

        if not User.objects.filter(username="admin").exists():

            User.objects.create_superuser(
                username="admin",
                email="admin@gmail.com",
                password="admin123"
            )

            return Response({"message": "superuser created"})

        return Response({"message": "already exists"})