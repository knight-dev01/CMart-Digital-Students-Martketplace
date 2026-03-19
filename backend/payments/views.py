import hmac
import hashlib
import json
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
from django.db import transaction
from orders.models import Order, OrderItem, CommissionRecord
from vendors.models import VendorWallet
from .models import Transaction

class InitializePaymentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        order_id = request.data.get('order_id')
        order = Order.objects.get(id=order_id, buyer=request.user)
        # In a real app, call Paystack API to get authorization_url
        # For MVP, we simulate or assume frontend handles redirection
        # We'll just create a pending transaction
        ref = f"PAY-{order.id}-{hash(request.user.email)}"
        Transaction.objects.create(
            order=order,
            payment_reference=ref,
            amount=order.total_amount,
            status='PENDING'
        )
        return Response({'reference': ref, 'amount': float(order.total_amount)})

class PaystackWebhookView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        # Verify Webhook (Simulated/Ready for integration)
        # paystack_signature = request.headers.get('x-paystack-signature')
        # secret = settings.PAYSTACK_SECRET_KEY
        # computed_signature = hmac.new(secret.encode(), request.body, hashlib.sha512).hexdigest()
        # if paystack_signature != computed_signature:
        #     return Response(status=status.HTTP_400_BAD_REQUEST)

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
                        
                        # Phase 4: Commission engine
                        self.process_commissions(order)
            except Transaction.DoesNotExist:
                return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(status=status.HTTP_200_OK)

    def process_commissions(self, order):
        for item in order.items.all():
            # 10% Platform Commission
            commission_amt = item.subtotal * 0.10
            vendor_amt = item.subtotal - commission_amt
            
            CommissionRecord.objects.create(
                order_item=item,
                platform_commission=commission_amt,
                vendor_earnings=vendor_amt
            )

            
            # Update Vendor Wallet
            wallet, created = VendorWallet.objects.get_or_create(vendor=item.vendor)
            wallet.balance += vendor_amt
            wallet.save()
