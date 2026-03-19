from django.urls import path
from .views import VendorApplicationView, ShopDetailView, ShopListView, ShopFollowView

urlpatterns = [
    path('apply/', VendorApplicationView.as_view(), name='vendor-apply'),
    path('shops/', ShopListView.as_view(), name='shop-list'),
    path('shops/<slug:shop_slug>/', ShopDetailView.as_view(), name='shop-detail'),
    path('shops/<slug:shop_slug>/follow/', ShopFollowView.as_view(), name='shop-follow'),
]
