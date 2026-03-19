from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Product, Category, Review
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer
from vendors.models import Vendor, Shop

class ProductListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at', 'view_count']

    def get_queryset(self):
        queryset = Product.objects.filter(active_status=True, shop__vendor__approval_status='APPROVED')
        
        # Campus Drops: Created in last 48 hours
        if self.request.query_params.get('campus_drops'):
            queryset = queryset.filter(created_at__gte=timezone.now() - timedelta(hours=48))
        
        # Popular on Campus: Based on views or likes (for MVP, let's use view_count > some threshold or just sort)
        if self.request.query_params.get('popular'):
             queryset = queryset.order_by('-view_count')

        return queryset

class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment View Counter
        instance.view_count += 1
        instance.save()
        return super().get(request, *args, **kwargs)

class UnifiedSearchView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response({'products': [], 'shops': []})

        products = Product.objects.filter(
            active_status=True,
            name__icontains=query
        ) | Product.objects.filter(
            active_status=True,
            description__icontains=query
        )
        products = products.distinct()[:20]

        shops = Shop.objects.filter(
            shop_name__icontains=query
        ) | Shop.objects.filter(
            description__icontains=query
        )
        shops = shops.distinct()[:20]

        product_serializer = ProductSerializer(products, many=True)
        # We need a ShopSerializer or just use a simple mapping
        shop_data = [{
            'id': s.id,
            'shop_name': s.shop_name,
            'description': s.description,
            'logo': s.logo
        } for s in shops]

        return Response({
            'products': product_serializer.data,
            'shops': shop_data
        })

class ProductLikeView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        if request.user in product.likes.all():
            product.likes.remove(request.user)
            return Response({'status': 'unliked'}, status=status.HTTP_200_OK)
        else:
            product.likes.add(request.user)
            return Response({'status': 'liked'}, status=status.HTTP_200_OK)

class CategoryListView(generics.ListAPIView):

    permission_classes = (permissions.AllowAny,)
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductCreateView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ProductSerializer

    def perform_create(self, serializer):
        user = self.request.user
        # Check if user has a vendor profile and shop
        if not hasattr(user, 'vendor_profile'):
            vendor = Vendor.objects.create(user=user, approval_status='APPROVED')
            Shop.objects.create(
                vendor=vendor,
                shop_name=f"{user.username}'s Closet",
                description="Student-to-student quick listings."
            )
        elif not hasattr(user.vendor_profile, 'shop'):
            Shop.objects.create(
                vendor=user.vendor_profile,
                shop_name=f"{user.username}'s Closet",
                description="Student-to-student quick listings."
            )
        
        serializer.save(shop=user.vendor_profile.shop)
