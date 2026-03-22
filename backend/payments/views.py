import json
import logging
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.db import transaction
from orders.models import Order, OrderItem
from .models import Transaction
from . import services

logger = logging.getLogger(__name__)

class InitializePaymentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        order_id = request.data.get('order_id')
        if not order_id:
            return Response({'error': 'order_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            order = Order.objects.get(id=order_id, buyer=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.payment_status == 'PAID':
            return Response({'error': 'Order is already paid'}, status=status.HTTP_400_BAD_REQUEST)

        ref = f"PAY-{order.id}-{hash(request.user.email)}"
        
        # Create pending transaction
        txn, _ = Transaction.objects.get_or_create(
            order=order,
            defaults={
                'payment_reference': ref,
                'amount': order.total_amount,
                'status': 'PENDING'
            }
        )

        try:
            # Call Paystack initialization
            paystack_data = services.initialize_transaction(
                email=request.user.email,
                amount_naira=float(order.total_amount),
                reference=txn.payment_reference,
                callback_url=request.data.get('callback_url')
            )
            return Response({
                'authorization_url': paystack_data['authorization_url'],
                'access_code': paystack_data['access_code'],
                'reference': paystack_data['reference']
            })
        except Exception as e:
            logger.error(f"Paystack initialization failed: {str(e)}")
            return Response({'error': 'Payment initialization failed'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class PaystackWebhookView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        paystack_signature = request.headers.get('x-paystack-signature')
        if not paystack_signature:
            return Response({'error': 'Missing signature'}, status=status.HTTP_400_BAD_REQUEST)

        # Verify Webhook signature
        is_valid = services.validate_webhook_signature(request.body, paystack_signature)
        if not is_valid:
            logger.warning("Invalid Paystack webhook signature")
            return Response(status=status.HTTP_400_BAD_REQUEST)

        payload = request.data
        if payload.get('event') == 'charge.success':
            data = payload.get('data')
            reference = data.get('reference')
            
            try:
                with transaction.atomic():
                    txn = Transaction.objects.select_related('order').get(payment_reference=reference)
                    if txn.status != 'SUCCESS':
                        txn.status = 'SUCCESS'
                        txn.save()
                        
                        order = txn.order
                        order.payment_status = 'PAID'
                        order.save()
                        
                        # Process commission distribution securely
                        order.complete_order()
            except Transaction.DoesNotExist:
                logger.error(f"Webhook transaction not found for ref: {reference}")
                return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)
