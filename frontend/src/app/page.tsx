'use client';

import React from 'react';
import { CampusDrops, MarketTicker, TopVendorsCarousel, MarketCategories } from '@/components/CampusEngagement';
import { FeaturedShops, ProductAd, FeaturedAds, AIShopAssistant } from '@/components/SocialEngagement';

const mockProducts = [
  { id: 1, name: "Vintage Oversized Tee", price: 4500, shop_name: "Felix Thrift", view_count: 42, likes_count: 12, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80' },
  { id: 2, name: "Noise Cancelling Pods", price: 15000, shop_name: "Gadget Hub", view_count: 89, likes_count: 34, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80' },
  { id: 3, name: "Handmade Beaded Bag", price: 8000, shop_name: "Beads by Joy", view_count: 15, likes_count: 5, image: 'https://images.unsplash.com/photo-1598533123413-96c56f6b45e6?auto=format&fit=crop&q=80' },
];

const mockActivities = [
  { id: 1, message: "Jane just opened a new shop: The Thrift Corner", timestamp: "10 mins ago" },
  { id: 2, message: "3 students just purchased sneakers from Sneaker Palace", timestamp: "1 hour ago" },
];

const mockShops = [
  { id: 1, shop_name: "Thrift by Tobi", shop_slug: "thrift-by-tobi", description: "Best quality second-hand clothes on campus. Affordable and stylish.", is_verified: true, followers_count: 120, product_count: 45 },
  { id: 2, shop_name: "Gadget Central", shop_slug: "gadget-central", description: "Your one-stop shop for all student gadgets and accessories.", is_verified: false, followers_count: 85, product_count: 12 },
  { id: 3, shop_name: "Beads by Joy", shop_slug: "beads-by-joy", description: "Authentic handmade accessories for students.", is_verified: true, followers_count: 15, product_count: 5 },
  { id: 4, shop_name: "Felix Thrift", shop_slug: "felix-thrift", description: "Campus thrift plug.", is_verified: true, followers_count: 42, product_count: 12 },
];

import { productService } from '@/services/product';

export default function Home() {
  const [products, setProducts] = React.useState(mockProducts);
  const [shops, setShops] = React.useState(mockShops);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dbProducts = await productService.getProducts();
        if (dbProducts && dbProducts.length > 0) {
          // Map real DB products to the UI structure if needed
          const mappedProducts = dbProducts.map((p: any) => ({
            ...p,
            image: p.images && p.images.length > 0 ? p.images[0].image : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80'
          }));
          setProducts(mappedProducts);
        }

        const dbShops = await productService.getShops();
        if (dbShops && dbShops.length > 0) {
          setShops(dbShops);
        }
      } catch (error) {
        console.error("Failed to fetch marketplace data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen text-[var(--foreground)] font-sans pb-24 md:pb-12 transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-0 sm:px-4 md:px-8 py-2 md:py-6">

        {/* Sticky Top Section (Shop Circles + Ticker) - Floating & Rounded */}
        <div className="sticky top-[72px] z-40 px-4 py-4 rounded-[2rem] mx-2 sm:mx-0 mb-8 transition-all duration-500">
          <FeaturedShops shops={shops} />
          <div className="mt-4 overflow-hidden rounded-full">
            <MarketTicker activities={mockActivities} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Marketplace Feed */}
          <div className="lg:col-span-8 flex flex-col items-center">

            {/* 3. Featured Ads - High Impact Gallery */}
            <div className="w-full mb-8 p-6 sm:p-10 rounded-t-[3.5rem] bg-white/[0.05] dark:bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/10 transition-all duration-500">
              <FeaturedAds shops={shops} />
            </div>

            {/* 4. Top Vendors Carousel - Discovery Break */}
            <div className="w-full border-y border-[var(--border-color)] bg-[var(--card-bg)]/30">
              <TopVendorsCarousel shops={shops} />
            </div>

            {/* 4.5 Campus Drops - Newest Items */}
            <div className="w-full mt-4">
              <CampusDrops products={products.slice(0, 6)} />
            </div>

            {/* 5. Product Ads - Main Market Listings */}
            <div className="w-full max-w-[min(600px,100vw)] mt-10 transition-all">
              <h2 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight px-4 sm:px-0 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                Market Listings
              </h2>

              {/* Quick Filters */}
              <MarketCategories />

              <div className="space-y-4 sm:space-y-8 mt-6">
                {products.map(product => (
                  <ProductAd key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Sidebar - Lowered Stationary Box */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-64 h-fit space-y-8 px-4 sm:px-0">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl shadow-black/40">
              <h3 className="font-black text-[var(--text-muted)] text-[10px] uppercase tracking-widest mb-6 opacity-40">Market Insights</h3>
              <div className="space-y-4">
                {mockActivities.map(activity => (
                  <div key={activity.id} className="flex gap-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 mt-1.5 group-hover:scale-150 transition-all"></div>
                    <p className="text-xs text-[var(--foreground)] font-medium leading-relaxed opacity-60 group-hover:opacity-100 transition-all font-sans">{activity.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* Global Footer */}
        <footer className="mt-20 pb-10 border-t border-[var(--border-color)] pt-10 text-center">
          <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em]">
            © 2026 CMART MARKETPLACE • CAMPUS-FIRST DIGITAL ECONOMY
          </p>
        </footer>
      </main>

      {/* Floating Branded AI Assistant */}
      <AIShopAssistant />
    </div>
  );
}


