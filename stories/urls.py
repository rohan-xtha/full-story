from django.urls import path
from .views import StoryListCreate, StoryRetrieveUpdateDestroy, RegisterView

urlpatterns = [
    path('stories/', StoryListCreate.as_view(), name='story-list-create'),
    path('stories/<int:pk>/', StoryRetrieveUpdateDestroy.as_view(), name='story-detail'),
    path('register/', RegisterView.as_view(), name='register'),
]
