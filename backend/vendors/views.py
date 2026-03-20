from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Vendor, Shop, VendorWallet
from .serializers import VendorSerializer, ShopSerializer

class VendorApplicationView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = VendorSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ShopDetailView(generics.RetrieveUpdateAPIView):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = ShopSerializer
    queryset = Shop.objects.all()

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get('shop_slug')
        
        # Try slug first
        obj = queryset.filter(shop_slug=lookup_value).first()
        if obj:
            return obj
            
        # Fallback to ID if numeric
        if lookup_value.isdigit():
            obj = queryset.filter(id=lookup_value).first()
            if obj:
                return obj
                
        # If still not found, raise 404 correctly
        return get_object_or_404(queryset, shop_slug=lookup_value)

class ShopListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ShopSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['shop_name', 'description']
    ordering_fields = ['created_at']

    def get_queryset(self):
        queryset = Shop.objects.filter(vendor__approval_status='APPROVED')
        # Featured Student Shops (e.g., verified or marked featured)
        if self.request.query_params.get('featured'):
            queryset = queryset.filter(vendor__is_verified=True)
        return queryset

class ShopFollowView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, shop_slug):
        shop = get_object_or_404(Shop, shop_slug=shop_slug)
        if request.user in shop.followers.all():
            shop.followers.remove(request.user)
            return Response({'status': 'unfollowed'}, status=status.HTTP_200_OK)
        else:
            shop.followers.add(request.user)
            return Response({'status': 'followed'}, status=status.HTTP_200_OK)

