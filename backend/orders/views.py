from rest_framework import status, permissions, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem
from .serializers import CartSerializer, CartItemSerializer, OrderSerializer
from products.models import Product

class CartView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        product = get_object_or_404(Product, id=product_id)
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, 
            product=product,
            defaults={'shop': product.shop, 'quantity': quantity}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()
            
        return Response(CartSerializer(cart).data, status=status.HTTP_201_CREATED)

class CartSyncView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        items_data = request.data.get('items', [])
        
        # Clear existing items and replace with sync data
        cart.items.all().delete()
        
        for item in items_data:
            try:
                product = Product.objects.get(id=item['id'])
                CartItem.objects.create(
                    cart=cart,
                    product=product,
                    shop=product.shop,
                    quantity=int(item.get('quantity', 1))
                )
            except Product.DoesNotExist:
                continue
                
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

class CheckoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        if not cart.items.exists():
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)
        
        total_amount = sum(item.product.price * item.quantity for item in cart.items.all())
        
        order = Order.objects.create(
            buyer=request.user,
            total_amount=total_amount,
            payment_status='PENDING'
        )
        
        for item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=item.product,
                shop=item.shop,
                vendor=item.shop.vendor,
                price=item.product.price,
                quantity=item.quantity
            )
        
        # Clear cart after order creation (or wait for payment? Usually wait for payment but for MVP we can clear or mark as ordered)
        # For now, let's keep it until payment is confirmed or just clear it.
        cart.items.all().delete()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

class OrderListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(buyer=self.request.user)
