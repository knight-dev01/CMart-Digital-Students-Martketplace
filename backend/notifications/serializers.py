from rest_framework import serializers
from .models import Notification, CampusActivity

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class CampusActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CampusActivity
        fields = '__all__'
