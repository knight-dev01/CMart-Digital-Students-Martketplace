from django.db.models.signals import post_save
from django.dispatch import receiver
from vendors.models import Shop
from products.models import Product
from orders.models import Order
from .models import CampusActivity, Notification

@receiver(post_save, sender=Shop)
def shop_activity(sender, instance, created, **kwargs):
    if created:
        CampusActivity.objects.create(
            message=f"{instance.shop_name} just joined the campus marketplace!",
            activity_type=CampusActivity.ActivityType.SHOP_JOINED
        )

@receiver(post_save, sender=Product)
def product_activity(sender, instance, created, **kwargs):
    if created:
        CampusActivity.objects.create(
            message=f"New {instance.category.name if instance.category else 'product'} added: {instance.name}",
            activity_type=CampusActivity.ActivityType.PRODUCT_ADDED
        )
        # Notify followers of the shop
        followers = instance.shop.followers.all()
        for follower in followers:
            Notification.objects.create(
                user=follower,
                message=f"{instance.shop.shop_name} added a new product: {instance.name}",
                notification_type=Notification.Type.ENGAGEMENT,
                link=f"/product/{instance.id}"
            )

@receiver(post_save, sender=Order)
def order_activity(sender, instance, created, **kwargs):
    if created:
        # We only really care about paid orders for global feed, 
        # but for user notification we do it on creation too
        Notification.objects.create(
            user=instance.buyer,
            message=f"Your order #{instance.id} has been placed!",
            notification_type=Notification.Type.ORDER,
            link=f"/order/{instance.id}"
        )
