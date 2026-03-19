from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'username', 'role', 'university', 'is_staff', 'is_active')
    list_filter = ('role', 'university', 'is_staff', 'is_superuser', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Role Information', {'fields': ('role', 'name', 'university')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Information', {'fields': ('role', 'name', 'university')}),
    )
    ordering = ('email',)

admin.site.register(User, CustomUserAdmin)
