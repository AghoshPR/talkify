# chat/views.py

from django.http import HttpResponse

def chat_home(request):
    return HttpResponse("Chat working")