from django.urls import path
from .views import PaystackWebhookView, InitializePaymentView

urlpatterns = [
    path('initialize/', InitializePaymentView.as_view(), name='payment-initialize'),
    path('webhook/', PaystackWebhookView.as_view(), name='payment-webhook'),
]
