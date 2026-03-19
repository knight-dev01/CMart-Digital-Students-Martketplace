'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { productService } from '@/services/product';
import { useCart } from './CartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';

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

// Individual Product Card for Campus Drops
const CampusDropCard = ({ product }: { product: any }) => {
    const { addToCart } = useCart();
    const { handleAuthAction } = useRequireAuth();
    const [isLiked, setIsLiked] = useState(product.is_liked || false);
    const [likesCount, setLikesCount] = useState(product.likes_count || 0);

    const handleLike = async () => {
        try {
            await productService.likeProduct(product.id);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error("Liking failed:", err);
        }
    };

    return (
        <div className="flex-none w-[240px] sm:w-64 glass-card rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all transform hover:-translate-y-1 snap-start text-left">
            <Link href={`/products/${product.id}`} className="relative h-40 w-full bg-[var(--border-color)]/20 overflow-hidden block group/img">
                <img src={product.images?.[0]?.image || 'https://via.placeholder.com/300?text=Product'} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
            </Link>
            <div className="p-4">
                <Link href={`/shops/${product.shop_slug || product.vendor_id}`} className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mb-1 hover:underline block">{product.shop_name}</Link>
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-base font-bold text-[var(--foreground)] truncate hover:text-emerald-500 transition-colors cursor-pointer">{product.name}</h3>
                </Link>
                <p className="text-lg font-black text-[var(--foreground)] mt-1">₦{Number(product.price).toLocaleString()}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        {product.view_count} students
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToCart(product);
                            }}
                            className="p-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
                            title="Add to Cart"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </button>
                        <button
                            onClick={() => handleAuthAction(handleLike)}
                            className={`flex items-center gap-1 transition-transform active:scale-95 ${isLiked ? 'text-red-500 scale-110' : 'text-emerald-600'}`}
                        >
                            <svg className="w-3 h-3" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                            {likesCount}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Campus Drops Component: Highlights new products
export const CampusDrops = ({ products }: { products: any[] }) => {
    return (
        <section className="my-8 px-2 md:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] uppercase tracking-tight">🔥 Campus Drops</h2>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 px-3 py-1 rounded-full w-fit">New in last 48h</span>
            </div>
            <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {products?.map(product => (
                    <CampusDropCard key={product.id} product={product} />
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


import { StudentShopCard } from './StudentShopCard';

// Student Shop Card logic removed and imported from StudentShopCard.tsx
