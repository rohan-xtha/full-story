from rest_framework import serializers
from .models import Story

class StorySerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Story
        fields = '__all__'
