from django.contrib import admin
from .models import Vendor, Shop, VendorWallet

@admin.register(Vendor)
class VendorAdmin(admin.ModelAdmin):
    list_display = ('user', 'approval_status', 'is_verified', 'created_at')
    list_filter = ('approval_status', 'is_verified')
    search_fields = ('user__email',)
    actions = ['approve_vendors', 'reject_vendors']

    def approve_vendors(self, request, queryset):
        queryset.update(approval_status='APPROVED')
    approve_vendors.short_description = "Approve selected vendors"

    def reject_vendors(self, request, queryset):
        queryset.update(approval_status='REJECTED')
    reject_vendors.short_description = "Reject selected vendors"

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('shop_name', 'vendor', 'created_at')
    search_fields = ('shop_name', 'vendor__user__email')
    prepopulated_fields = {'shop_slug': ('shop_name',)}

@admin.register(VendorWallet)
class VendorWalletAdmin(admin.ModelAdmin):
    list_display = ('vendor', 'balance', 'updated_at')
