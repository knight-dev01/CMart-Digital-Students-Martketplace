from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('shops/', TemplateView.as_view(template_name='shops_list.html'), name='shops_list'),
    path('shops/<slug:shop_slug>/', TemplateView.as_view(template_name='shop_detail.html'), name='shop_detail_view'),
    path('products/', TemplateView.as_view(template_name='products_list.html'), name='products_list'),
    path('products/<int:pk>/', TemplateView.as_view(template_name='product_detail.html'), name='product_detail_view'),

    path('admin/', admin.site.urls),

    path('api/auth/', include('users.urls')),
    path('api/vendors/', include('vendors.urls')),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/chat/', include('chat.urls')),

    # Swagger/OpenAPI Endpoints
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


