from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    class Role(models.TextChoices):
        BUYER = 'BUYER', _('Buyer')
        VENDOR = 'VENDOR', _('Vendor')
        ADMIN = 'ADMIN', _('Admin')
        SUPERADMIN = 'SUPERADMIN', _('SuperAdmin')

    email = models.EmailField(_('email address'), unique=True)
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.BUYER
    )
    university = models.CharField(
        max_length=100,
        default='Trinity University'
    )
    name = models.CharField(max_length=255, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
