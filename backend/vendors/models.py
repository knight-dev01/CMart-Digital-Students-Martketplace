from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Vendor(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vendor_profile')
    approval_status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    verification_status = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False) # Campus trust indicator
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.approval_status}"

class Shop(models.Model):
    vendor = models.OneToOneField(Vendor, on_delete=models.CASCADE, related_name='shop')
    shop_name = models.CharField(max_length=255)
    shop_slug = models.SlugField(unique=True, blank=True)
    banner_image = models.URLField(max_length=500, blank=True, null=True)
    logo = models.URLField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True)
    followers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='followed_shops', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.shop_slug:
            self.shop_slug = slugify(self.shop_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.shop_name

class VendorWallet(models.Model):
    vendor = models.OneToOneField(Vendor, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.vendor.shop.shop_name} Wallet: {self.balance}"
