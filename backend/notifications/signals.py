from django.db.models.signals import post_save, m2m_changed
from django.dispatch import receiver
from vendors.models import Shop, Vendor
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
        # Notify the vendor they successfully created a shop
        Notification.objects.create(
            user=instance.vendor.user,
            message=f"Congratulations! Your shop '{instance.shop_name}' is now live.",
            notification_type=Notification.Type.SYSTEM,
            link=f"/shops/{instance.shop_slug}"
        )

@receiver(m2m_changed, sender=Shop.followers.through)
def shop_follow_notification(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        from django.contrib.auth import get_user_model
        User = get_user_model()
        for pk in pk_set:
            follower = User.objects.get(pk=pk)
            Notification.objects.create(
                user=instance.vendor.user,
                message=f"You have an engagement! {follower.username if follower.username else follower.email} started following your shop.",
                notification_type=Notification.Type.ENGAGEMENT,
                link=f"/shops/{instance.shop_slug}"
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
                link=f"/products/{instance.id}"
            )

@receiver(m2m_changed, sender=Product.likes.through)
def product_like_notification(sender, instance, action, pk_set, **kwargs):
    if action == "post_add":
        from django.contrib.auth import get_user_model
        User = get_user_model()
        for pk in pk_set:
            liker = User.objects.get(pk=pk)
            Notification.objects.create(
                user=instance.shop.vendor.user,
                message=f"New Engagement! Someone liked your product: {instance.name}",
                notification_type=Notification.Type.ENGAGEMENT,
                link=f"/products/{instance.id}"
            )

@receiver(post_save, sender=Order)
def order_activity(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.buyer,
            message=f"Your order #{instance.id} has been placed!",
            notification_type=Notification.Type.ORDER,
            link=f"/orders/{instance.id}"
        )

@receiver(post_save, sender=Vendor)
def vendor_approval_notification(sender, instance, **kwargs):
    # This is a simplified check for approval status
    if instance.approval_status == 'APPROVED':
        Notification.objects.create(
            user=instance.user,
            message="Your vendor application has been approved! You can now start listing products.",
            notification_type=Notification.Type.SYSTEM,
            link="/vendor/dashboard"
        )
