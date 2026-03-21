from django.urls import path
from .views import CartView, CartSyncView, CheckoutView, OrderListView

urlpatterns = [
    path('cart/', CartView.as_view(), name='cart'),
    path('cart/sync/', CartSyncView.as_view(), name='cart-sync'),
    path('checkout/', CheckoutView.as_view(), name='checkout'),
    path('orders/', OrderListView.as_view(), name='order-list'),
]
