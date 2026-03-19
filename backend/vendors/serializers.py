from rest_framework import serializers
from .models import Vendor, Shop, VendorWallet

class ShopSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    vendor_user_id = serializers.ReadOnlyField(source='vendor.user.id')

    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ('vendor', 'shop_slug')

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_is_following(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return obj.followers.filter(id=user.id).exists()
        return False


class VendorSerializer(serializers.ModelSerializer):
    shop = ShopSerializer(read_only=True)
    user_name = serializers.ReadOnlyField(source='user.name')

    class Meta:
        model = Vendor
        fields = ('id', 'user_name', 'shop', 'approval_status', 'verification_status', 'is_verified', 'created_at')
        read_only_fields = ('user', 'approval_status', 'verification_status', 'is_verified')


class VendorWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = VendorWallet
        fields = ('balance', 'updated_at')
