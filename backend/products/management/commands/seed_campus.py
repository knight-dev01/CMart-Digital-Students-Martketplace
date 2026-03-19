from django.core.management.base import BaseCommand
from django.utils.text import slugify
from products.models import Category

class Command(BaseCommand):
    help = 'Seed campus marketplace categories'

    def handle(self, *args, **kwargs):
        categories = [
            'Fashion & Thrift',
            'Sneakers & Shoes',
            'Hair & Beauty',
            'Gadgets & Accessories',
            'Food & Snacks',
            'Services (Design, Typing, Tutoring)'
        ]
        
        for cat_name in categories:
            Category.objects.get_or_create(
                name=cat_name,
                slug=slugify(cat_name)
            )
            self.stdout.write(self.style.SUCCESS(f'Successfully seeded category: {cat_name}'))
