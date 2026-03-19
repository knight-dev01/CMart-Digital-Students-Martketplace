from django.db import models
from django.conf import settings

class Notification(models.Model):
    class Type(models.TextChoices):
        ENGAGEMENT = 'ENGAGEMENT', 'Engagement'
        ORDER = 'ORDER', 'Order'
        SYSTEM = 'SYSTEM', 'System'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=Type.choices, default=Type.SYSTEM)
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.email}: {self.message[:20]}"

class CampusActivity(models.Model):
    class ActivityType(models.TextChoices):
        SHOP_JOINED = 'SHOP_JOINED', 'New Student Shop'
        PRODUCT_ADDED = 'PRODUCT_ADDED', 'New Campus Listing'
        SALE_MADE = 'SALE_MADE', 'Recent Campus Purchase'

    message = models.CharField(max_length=255)
    activity_type = models.CharField(max_length=20, choices=ActivityType.choices)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Campus Activities'
        ordering = ['-timestamp']

    def __str__(self):
        return self.message
