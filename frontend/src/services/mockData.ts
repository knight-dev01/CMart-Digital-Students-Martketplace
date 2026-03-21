export const mockProducts = [
  { 
    id: 1, 
    name: "Vintage Oversized Tee", 
    price: 4500, 
    shop_name: "Felix Thrift", 
    shop_slug: "felix-thrift",
    view_count: 42, 
    likes_count: 12, 
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80',
    description: "Classic vintage feel, perfect for campus days."
  },
  { 
    id: 2, 
    name: "Noise Cancelling Pods", 
    price: 15000, 
    shop_name: "Gadget Hub", 
    shop_slug: "gadget-central",
    view_count: 89, 
    likes_count: 34, 
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80',
    description: "Study in peace with industry-leading noise cancellation."
  },
  { 
    id: 3, 
    name: "Handmade Beaded Bag", 
    price: 8000, 
    shop_name: "Beads by Joy", 
    shop_slug: "beads-by-joy",
    view_count: 15, 
    likes_count: 5, 
    image: 'https://images.unsplash.com/photo-1598533123413-96c56f6b45e6?auto=format&fit=crop&q=80',
    description: "Unique handmade accessory to stand out."
  },
];

export const mockActivities = [
  { id: 1, message: "Jane just opened a new shop: The Thrift Corner", timestamp: "10 mins ago" },
  { id: 2, message: "3 students just purchased sneakers from Sneaker Palace", timestamp: "1 hour ago" },
];

export const mockShops = [
  { 
    id: 1, 
    shop_name: "Thrift by Tobi", 
    shop_slug: "thrift-by-tobi", 
    description: "Best quality second-hand clothes on campus. Affordable and stylish.", 
    is_verified: true, 
    followers_count: 120, 
    product_count: 45,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Tobi&backgroundColor=059669"
  },
  { 
    id: 2, 
    shop_name: "Gadget Central", 
    shop_slug: "gadget-central", 
    description: "Your one-stop shop for all student gadgets and accessories.", 
    is_verified: false, 
    followers_count: 85, 
    product_count: 12,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Gadget&backgroundColor=059669"
  },
  { 
    id: 3, 
    shop_name: "Beads by Joy", 
    shop_slug: "beads-by-joy", 
    description: "Authentic handmade accessories for students.", 
    is_verified: true, 
    followers_count: 15, 
    product_count: 5,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Joy&backgroundColor=059669"
  },
  { 
    id: 4, 
    shop_name: "Felix Thrift", 
    shop_slug: "felix-thrift", 
    description: "Campus thrift plug.", 
    is_verified: true, 
    followers_count: 42, 
    product_count: 12,
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=Felix&backgroundColor=059669"
  },
];
