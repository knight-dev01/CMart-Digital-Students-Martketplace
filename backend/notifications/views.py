from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification, CampusActivity
from .serializers import NotificationSerializer, CampusActivitySerializer

class NotificationListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

class NotificationReadView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        notification = generics.get_object_or_404(Notification, pk=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response(status=status.HTTP_200_OK)

class CampusActivityListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = CampusActivitySerializer
    queryset = CampusActivity.objects.all()[:20] # Last 20 activities
