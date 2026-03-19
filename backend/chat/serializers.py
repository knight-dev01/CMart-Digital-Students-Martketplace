from rest_framework import serializers
from .models import Conversation, Message
from users.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.ReadOnlyField(source='sender.username')
    
    class Meta:
        model = Message
        fields = ('id', 'conversation', 'sender', 'sender_name', 'text', 'is_read', 'created_at')

class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participants = UserSerializer(many=True, read_only=True)
    
    class Meta:
        model = Conversation
        fields = ('id', 'participants', 'product', 'created_at', 'updated_at', 'messages')
