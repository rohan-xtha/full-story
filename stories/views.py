from rest_framework import generics
from .models import Story
from .serializers import StorySerializer

class StoryListCreate(generics.ListCreateAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer

class StoryRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
