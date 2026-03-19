from decimal import Decimal
from django.db import models
from django.conf import settings
from products.models import Product
from vendors.models import Shop, Vendor

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.email}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        PAID = 'PAID', 'Paid'
        FAILED = 'FAILED', 'Failed'
        COMPLETED = 'COMPLETED', 'Completed'

    buyer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.buyer.email}"

    def complete_order(self):
        """Logic to handle commission and vendor payout."""
        if self.payment_status != 'PAID':
            return False
            
        for item in self.items.all():
            # Calculate 5% Platform Commission
            commission_amount = item.subtotal * Decimal('0.05')
            vendor_payout = item.subtotal - commission_amount
            
            # Record Commission
            CommissionRecord.objects.create(
                order_item=item,
                platform_commission=commission_amount,
                vendor_earnings=vendor_payout
            )
            
            # Update Vendor Wallet
            from vendors.models import VendorWallet
            wallet, _ = VendorWallet.objects.get_or_create(vendor=item.vendor)
            wallet.balance += vendor_payout
            wallet.save()
            
        self.payment_status = 'COMPLETED'
        self.save()
        return True

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField()
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name if self.product else 'Deleted Product'}"

class CommissionRecord(models.Model):
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE, related_name='commission')
    platform_commission = models.DecimalField(max_digits=12, decimal_places=2)
    vendor_earnings = models.DecimalField(max_digits=12, decimal_places=2)
    calculated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Commission for OrderItem {self.order_item.id}"
