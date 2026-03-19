from django.urls import path
from .views import NotificationListView, NotificationReadView, CampusActivityListView

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/read/', NotificationReadView.as_view(), name='notification-read'),
    path('activity/', CampusActivityListView.as_view(), name='campus-activity'),
]
