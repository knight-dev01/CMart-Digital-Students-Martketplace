from django.urls import path
from .views import ProductListView, ProductDetailView, CategoryListView, ProductCreateView, ProductLikeView, UnifiedSearchView

urlpatterns = [
    path('', ProductListView.as_view(), name='product-list'),
    path('search/', UnifiedSearchView.as_view(), name='search'),
    path('create/', ProductCreateView.as_view(), name='product-create'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('<int:pk>/like/', ProductLikeView.as_view(), name='product-like'),
]
