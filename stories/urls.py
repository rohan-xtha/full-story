from django.urls import path
from .views import StoryListCreate, StoryRetrieveUpdateDestroy

urlpatterns = [
    path('stories/', StoryListCreate.as_view(), name='story-list-create'),
    path('stories/<int:pk>/', StoryRetrieveUpdateDestroy.as_view(), name='story-retrieve-update-destroy'),
]
