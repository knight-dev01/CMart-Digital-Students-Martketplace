'use client';

import React from 'react';
import { CampusDrops, MarketTicker, TopVendorsCarousel, MarketCategories } from '@/components/CampusEngagement';
import { FeaturedShops, FeaturedAds, AIShopAssistant } from '@/components/SocialEngagement';
import { ProductCard } from '@/components/ProductCard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Product } from '@/types';

import { mockProducts, mockActivities, mockShops } from '@/services/mockData';

import { productService } from '@/services/product';

import { useNotifications } from '@/components/NotificationContext';

export default function Home() {
  const { activities } = useNotifications();
  const [products, setProducts] = React.useState<any[]>(mockProducts);
  const [shops, setShops] = React.useState<any[]>(mockShops);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const dbProducts = await productService.getProducts();
        if (dbProducts && dbProducts.length > 0) {
          // Map real DB products to the UI structure if needed
          const mappedProducts = dbProducts.map((p: Product) => ({
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
            <MarketTicker activities={activities.length > 0 ? activities : mockActivities} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Main Marketplace Feed */}
          <div className="lg:col-span-8 flex flex-col items-center">

            {/* 3. Featured Ads - High Impact Gallery */}
            <div className="w-full mb-8 p-6 sm:p-10 rounded-t-[3.5rem] bg-white/[0.05] dark:bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-2xl shadow-black/10 transition-all duration-500">
              <ErrorBoundary>
                <FeaturedAds shops={shops} />
              </ErrorBoundary>
            </div>

            {/* 4. Top Vendors Carousel - Discovery Break */}
            <div className="w-full border-y border-[var(--border-color)] bg-[var(--card-bg)]/30">
              <TopVendorsCarousel shops={shops} />
            </div>

            {/* 4.5 Campus Drops - Newest Items */}
            <div className="w-full mt-4">
              <ErrorBoundary>
                <CampusDrops products={products.slice(0, 6)} />
              </ErrorBoundary>
            </div>

            {/* 5. Product Ads - Main Market Listings */}
            <div className="w-full mt-10 transition-all">
              <h2 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight px-4 sm:px-0 mb-4 flex items-center gap-2">
                <span className="w-2 h-8 bg-emerald-600 rounded-full"></span>
                Market Listings
              </h2>

              {/* Quick Filters */}
              <MarketCategories />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-6">
                <ErrorBoundary>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </ErrorBoundary>
              </div>
            </div>
          </div>

          {/* Desktop Sidebar - Lowered Stationary Box */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-64 h-fit space-y-8 px-4 sm:px-0">
            <div className="bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-2xl shadow-black/40">
              <h3 className="font-black text-[var(--text-muted)] text-[10px] uppercase tracking-widest mb-6 opacity-40">Market Insights</h3>
              <div className="space-y-4">
                {(activities.length > 0 ? activities : mockActivities).map((activity: Record<string, unknown> | any) => (
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


