import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from products.models import Category, Product, ProductImage
from vendors.models import Vendor, Shop, VendorWallet

User = get_user_model()

class Command(BaseCommand):
    help = 'Seed the database with realistic campus marketplace data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        # 1. Categories
        categories_data = [
            {'name': 'Fashion', 'slug': 'fashion'},
            {'name': 'Gadgets', 'slug': 'gadgets'},
            {'name': 'Food & Snacks', 'slug': 'food'},
            {'name': 'Academics', 'slug': 'academics'},
        ]
        
        for cat in categories_data:
            obj, created = Category.objects.get_or_create(slug=cat['slug'], defaults={'name': cat['name']})
            if created:
                self.stdout.write(f'Created category: {cat["name"]}')

        # 2. Vendors & Shops
        vendors_info = [
            {'email': 'tobi@cmart.com', 'username': 'tobi_thrift', 'shop': 'Thrift by Tobi', 'desc': 'Best quality second-hand clothes on campus.', 'logo': '/assets/market/thrift_shop_logo.png'},
            {'email': 'gadgetgate@cmart.com', 'username': 'gadget_hub', 'shop': 'Gadget Hub', 'desc': 'Your one-stop shop for all student gadgets and accessories.', 'logo': '/assets/market/gadget_hub.png'},
            {'email': 'joy@cmart.com', 'username': 'beads_by_joy', 'shop': 'Beads by Joy', 'desc': 'Handmade beaded accessories and bags.', 'logo': 'https://api.dicebear.com/7.x/initials/svg?seed=BeadsByJoy&backgroundColor=059669'},
            {'email': 'campus_eats@cmart.com', 'username': 'campus_eats', 'shop': 'Campus Eats', 'desc': 'Delicious meals and snacks delivered to your dorm.', 'logo': 'https://api.dicebear.com/7.x/initials/svg?seed=CampusEats&backgroundColor=059669'},
            {'email': 'nexus@cmart.com', 'username': 'nexus_tech', 'shop': 'Nexus Tech', 'desc': 'Premium electronics and laptop repairs.', 'logo': 'https://api.dicebear.com/7.x/initials/svg?seed=NexusTech&backgroundColor=059669'},
        ]

        # Product Templates
        products_templates = [
            {'name': 'Vintage Denim Jacket', 'price': 5000, 'cat': 'fashion', 'img': '/assets/market/denim_jacket.png'},
            {'name': 'Wireless Earbuds', 'price': 12000, 'cat': 'gadgets', 'img': '/assets/market/gadget_hub.png'},
            {'name': 'Student Notebook Set', 'price': 2500, 'cat': 'academics', 'img': 'https://images.unsplash.com/photo-1531346878377-a5be20888e57'},
            {'name': 'Spicy Jollof Rice (Large)', 'price': 1500, 'cat': 'food', 'img': 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26'},
            {'name': 'Oversized Graphic Tee', 'price': 3500, 'cat': 'fashion', 'img': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'},
            {'name': 'Laptop Stand', 'price': 8500, 'cat': 'gadgets', 'img': 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc'},
        ]

        for info in vendors_info:
            user, created = User.objects.get_or_create(
                email=info['email'],
                defaults={
                    'username': info['username'],
                    'role': User.Role.VENDOR,
                    'is_staff': True
                }
            )
            if created:
                user.set_password('password123')
                user.save()
            
            vendor, created = Vendor.objects.get_or_create(
                user=user,
                defaults={'approval_status': Vendor.Status.APPROVED, 'verification_status': True, 'is_verified': True}
            )
            
            shop, created = Shop.objects.get_or_create(
                vendor=vendor,
                defaults={
                    'shop_name': info['shop'],
                    'description': info['desc'],
                    'logo': info['logo']
                }
            )
            # Update logo if it changed (forced update for seeding)
            if not created and shop.logo != info['logo']:
                shop.logo = info['logo']
                shop.save()
            
            # Ensure Wallet exists
            VendorWallet.objects.get_or_create(vendor=vendor, defaults={'balance': random.randint(5000, 50000)})
            self.stdout.write(f'Processed shop: {info["shop"]}')

            # Create random products for this shop if they don't exist
            if not shop.products.exists():
                for _ in range(3):
                    p_template = random.choice(products_templates)
                    cat_obj = Category.objects.get(slug=p_template['cat'])
                    product = Product.objects.create(
                        shop=shop,
                        category=cat_obj,
                        name=f"{shop.shop_name} {p_template['name']}",
                        description=f"Authentic {p_template['name']} from {shop.shop_name}. Premium quality for campus life.",
                        price=p_template['price'] + random.randint(-500, 2000),
                        stock=random.randint(5, 50),
                        view_count=random.randint(10, 200)
                    )
                    ProductImage.objects.create(product=product, image=p_template['img'])

        # 4. Test Buyers
        buyers_info = [
            {'email': 'buyer1@cmart.com', 'username': 'john_doe'},
            {'email': 'buyer2@cmart.com', 'username': 'jane_doe'},
            {'email': 'student@trinity.edu', 'username': 'trinity_student'},
        ]
        for info in buyers_info:
            user, created = User.objects.get_or_create(
                email=info['email'],
                defaults={
                    'username': info['username'],
                    'role': User.Role.BUYER
                }
            )
            if created:
                user.set_password('password123')
                user.save()
                self.stdout.write(f'Created buyer: {info["username"]}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded marketplace data!'))
