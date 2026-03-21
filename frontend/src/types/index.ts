export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_vendor: boolean;
  role: string;
  avatar?: string;
}

export interface Shop {
  id: number;
  vendor_id: number;
  shop_name: string;
  slug: string;
  description: string;
  logo: string | null;
  banner: string | null;
  rating: string;
  created_at: string;
  items_sold?: number;
  followers_count?: number;
  product_count?: number;
  is_verified?: boolean;
  shop_slug?: string;
}

export interface ProductImage {
  id: number;
  image: string;
}

export interface Product {
  id: number;
  shop: number;
  shop_name: string;
  vendor_id?: number;
  vendor_user_id?: number;
  shop_logo: string | null;
  shop_slug?: string;
  name: string;
  description: string;
  price: string | number;
  category: number | string;
  condition: string;
  campus_drop: boolean;
  stock: number;
  is_active: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  image?: string;
  likes_count: number;
  is_liked: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
}

export interface VendorProfile {
  id: number;
  user: number | User;
  phone_number: string;
  matric_number: string;
  approval_status: string;
  shop?: Shop;
}

export interface Order {
  id: number;
  user: number;
  total_amount: string | number;
  status: string;
  created_at: string;
  reference?: string;
}

export interface PaymentInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface LoginCredentials {
  username?: string;
  email?: string;
  password?: string;
}

export interface RegisterData {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  re_password?: string;
}

export interface Conversation {
  id: number;
  participants: User[];
  product?: number;
  last_message?: string;
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: User | number | string;
  timestamp: string;
  conversation: number;
}
