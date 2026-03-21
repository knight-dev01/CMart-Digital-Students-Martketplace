'use client';

import React from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ProductCard } from './ProductCard';
import { StudentShopCard } from './StudentShopCard';

// Trust Indicator: Verified Student Vendor Badge
export const VerifiedBadge = () => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300">
        <svg className="mr-1 h-2 w-2 text-teal-400" fill="currentColor" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" />
        </svg>
        Verified Student Vendor
    </span>
);

// Market Categories: Quick discovery via horizontal pills
export const MarketCategories = () => {
    const categories = ['All', 'Textbooks', 'Electronics', 'Fashion', 'Home', 'Services', 'Food', 'Beauty'];
    const [selected, setSelected] = React.useState('All');

    return (
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide px-4 sm:px-0 mt-4 h-12 items-center">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setSelected(cat)}
                    className={`flex-none px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${selected === cat
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20 scale-105'
                        : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] hover:border-emerald-400'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

// CampusDropCard logic removed - use ProductCard.tsx (compact variant) instead

// Campus Drops Component: Highlights new products with horizontal navigation
export const CampusDrops = ({ products }: { products: any[] }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = React.useState(false);
    const [showRightArrow, setShowRightArrow] = React.useState(true);

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    React.useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            checkScroll();
            window.addEventListener('resize', checkScroll);
            return () => {
                el.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, []);

    return (
        <section className="my-8 px-2 md:px-0 relative group/drops">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] uppercase tracking-tight">🔥 Campus Drops</h2>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 px-3 py-1 rounded-full w-fit">New in last 48h</span>
                </div>
                
                {/* Desktop Navigation Arrows */}
                <div className="hidden sm:flex items-center gap-1.5">
                    <button
                        onClick={() => scroll('left')}
                        disabled={!showLeftArrow}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-color)] transition-all ${showLeftArrow ? 'bg-[var(--card-bg)] text-[var(--foreground)] opacity-100 hover:scale-110 active:scale-95 shadow-sm' : 'bg-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        disabled={!showRightArrow}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-color)] transition-all ${showRightArrow ? 'bg-[var(--card-bg)] text-[var(--foreground)] opacity-100 hover:scale-110 active:scale-95 shadow-sm' : 'bg-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </div>

            <div 
                ref={scrollRef}
                className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            >
                {products?.map(product => (
                    <ProductCard key={product.id} product={product} variant="compact" />
                ))}
            </div>
        </section>
    );
};

// Market Ticker: Horizontal scrolling activity feed for high mobile impact
export const MarketTicker = ({ activities }: { activities: any[] }) => (
    <div className="w-full bg-white/5 backdrop-blur-md border-y border-white/5 overflow-hidden py-2 sm:py-3">
        <div className="flex whitespace-nowrap animate-marquee">
            <div className="flex items-center space-x-8 px-4">
                {activities?.map((activity, idx) => (
                    <div key={`${activity.id}-${idx}`} className="flex items-center space-x-2 text-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{activity.message}</span>
                        <span className="text-[9px] opacity-70 font-bold">{activity.timestamp}</span>
                    </div>
                ))}
                {/* Duplicate for seamless loop */}
                {activities?.map((activity, idx) => (
                    <div key={`dup-${activity.id}-${idx}`} className="flex items-center space-x-2 text-white">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{activity.message}</span>
                        <span className="text-[9px] opacity-70 font-bold">{activity.timestamp}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Top Vendors Carousel: Horizontal vendor discovery for mobile
export const TopVendorsCarousel = ({ shops }: { shops: any[] }) => {
    const { handleAuthAction } = useRequireAuth();

    return (
        <section className="my-8 px-4 sm:px-0">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">Top Campus Vendors</h3>
                <button className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">See All</button>
            </div>
            <div className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory">
                {shops?.map(shop => (
                    <div key={shop.id} className="flex-none w-[200px] bg-[var(--card-bg)] rounded-[2rem] p-6 border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all snap-start text-center group cursor-pointer"
                        onClick={() => handleAuthAction(() => window.location.href = `/shops/${shop.shop_slug || shop.id}`)}
                    >
                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400 w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                            <div className="w-full h-full rounded-full border-2 border-[var(--background)] overflow-hidden bg-[var(--card-bg)]">
                                <img src={shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.shop_name}&backgroundColor=059669`} className="w-full h-full object-cover" alt="" />
                            </div>
                        </div>
                        <h4 className="text-sm font-black text-[var(--foreground)] truncate group-hover:text-emerald-500 transition-colors uppercase tracking-tight">{shop.shop_name}</h4>
                        <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Shop Profile</p>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAuthAction(() => { });
                            }}
                            className="mt-4 w-full py-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                            Follow
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

