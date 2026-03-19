'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { chatService } from '@/services/chat';
import { productService } from '@/services/product';
import { useCart } from './CartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ChatOverlay } from './ChatComponent';
import { SearchOverlay } from './SearchOverlay';
import { QuickSellModal } from './QuickSellModal';

// Featured Shops (Circles at the top)
export const FeaturedShops = ({ shops }: { shops: any[] }) => (
    <div className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-4 sm:pb-6 pt-2 scrollbar-hide px-4 sm:px-0 scroll-smooth">
        {shops.map((shop) => (
            <Link key={shop.id} href={`/shops/${shop.shop_slug || shop.id}`} className="flex-none flex flex-col items-center space-y-1 cursor-pointer group">
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-16 h-16 rounded-full border-2 border-[var(--background)] overflow-hidden glass-card shadow-lg group-hover:shadow-emerald-500/20">
                        <img src={shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.shop_name}&backgroundColor=059669`} alt={shop.shop_name} className="w-full h-full object-cover" />
                    </div>
                </div>
                <span className="text-[10px] font-black text-[var(--text-muted)] truncate w-16 text-center group-hover:text-emerald-500 transition-colors uppercase tracking-widest">{shop.shop_name}</span>
            </Link>
        ))}
        {/* Add Vendor Shop Button */}
        <Link href="/vendor/setup" className="flex-none flex flex-col items-center space-y-1 cursor-pointer group">
            <div className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-[var(--border-color)] flex items-center justify-center group-hover:border-emerald-400 transition-colors">
                <svg className="w-6 h-6 text-[var(--text-muted)] group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tight">Register Shop</span>
        </Link>
    </div>
);

// Product Ad Card (For Products or Shop Highlights)
export const ProductAd = ({ product }: { product: any }) => {
    const router = useRouter();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { handleAuthAction } = useRequireAuth();

    const [isLiked, setIsLiked] = useState(product.is_liked || false);
    const [likesCount, setLikesCount] = useState(product.likes_count || 0);
    const [showCopiedBadge, setShowCopiedBadge] = useState(false);

    const handleChat = async () => {
        if (!product.vendor_id && !product.vendor_user_id) return;
        try {
            const conv = await chatService.getOrCreateConversation(product.vendor_id || product.vendor_user_id);
            router.push(`/messages?convId=${conv.id}`);
        } catch (err) {
            console.error("Chat redirection failed:", err);
        }
    };

    const handleLike = async () => {
        try {
            await productService.likeProduct(product.id);
            setIsLiked(!isLiked);
            setLikesCount((prev: number) => isLiked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error("Liking failed:", err);
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/products/${product.id}`;
        navigator.clipboard.writeText(url);
        setShowCopiedBadge(true);
        setTimeout(() => setShowCopiedBadge(false), 2000);
    };

    return (
        <div className="w-full glass-card sm:rounded-[2.5rem] overflow-hidden mb-4 sm:mb-8 font-sans shadow-2xl shadow-emerald-500/5 transition-all relative">
            {/* Copied Badge Overlay */}
            {showCopiedBadge && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-2xl border border-emerald-400/30">
                        Link Copied!
                    </div>
                </div>
            )}
            
            {/* Ad Header */}
            {/* ... rest of header ... */}
            <div className="flex items-center justify-between p-4 px-4 sm:px-6">
                <div className="flex items-center space-x-3">
                    <div className="p-[1px] rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--background)]">
                            <img src={product.shop_logo || `https://api.dicebear.com/7.x/initials/svg?seed=${product.shop_name}&backgroundColor=059669`} alt={product.shop_name} />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[var(--foreground)] leading-none">{product.shop_name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none">Lagos, Nigeria</p>
                            <span className="w-1 h-1 bg-[var(--border-color)] rounded-full"></span>
                            <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md border border-green-100 dark:border-green-900/50">
                                <svg className="w-2.5 h-2.5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                <span className="text-[8px] font-black text-green-600 dark:text-green-400 uppercase tracking-tighter">Secure Escrow</span>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="text-[var(--text-muted)]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" /></svg>
                </button>
            </div>

            <Link href={`/products/${product.id}`} className="relative aspect-square sm:aspect-[4/5] bg-[var(--border-color)]/20 flex items-center justify-center overflow-hidden cursor-pointer group/img">
                <img
                    src={product.image || 'https://images.unsplash.com/photo-1521103669931-180c57pre.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                />
                {/* Overlay for price/badge */}
                <div className="absolute top-4 right-4 bg-[var(--background)]/60 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-[var(--foreground)]/10">
                    <span className="text-xs font-black text-[var(--foreground)]">₦{Number(product.price).toLocaleString()}</span>
                </div>

                {(!user || user.role === 'BUYER') && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addToCart(product);
                        }}
                        className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 bg-emerald-600/90 backdrop-blur-xl text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-emerald-500/50 hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all opacity-0 group-hover:opacity-100 sm:translate-y-4 group-hover:translate-y-0"
                    >
                        Add to Cart
                    </button>
                )}
            </Link>

            {/* Ad Actions */}
            <div className="p-4 px-4 sm:px-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => handleAuthAction(handleLike)}
                            className={`${isLiked ? 'text-red-500 scale-110' : 'text-[var(--foreground)]'} hover:text-red-500 transition-all active:scale-95`}
                        >
                            <svg className="w-7 h-7" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                        <button
                            onClick={() => handleAuthAction(handleChat)}
                            className="text-[var(--foreground)] hover:text-[#10b981] transition-colors"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </button>
                        <button
                            onClick={handleShare}
                            className="text-[var(--foreground)] hover:text-emerald-600 transition-colors"
                        >
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        </button>
                    </div>
                    <button
                        onClick={() => handleAuthAction(() => addToCart(product))}
                        className="text-[var(--foreground)] hover:text-emerald-500 transition-colors active:scale-95"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    </button>
                </div>

                {/* Likes & Caption */}
                <div className="space-y-1">
                    <p className="text-xs font-black text-[var(--foreground)]">{likesCount} students like this</p>
                    <div className="text-sm">
                        <Link href={`/shops/${product.shop_slug || product.vendor_id}`} className="font-black text-[var(--foreground)] mr-2 hover:text-emerald-500 transition-colors">{product.shop_name}</Link>
                        <Link href={`/products/${product.id}`} className="text-[var(--text-muted)] font-medium leading-relaxed hover:text-[var(--foreground)] transition-colors">{product.name} — fresh campus drop! 🔥 #CampusLife #StudentVendor</Link>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest pt-1">3 hours ago</p>
                </div>
            </div>
        </div>
    );
};

export const FeaturedAds = ({ shops }: { shops: any[] }) => {
    const router = useRouter();
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<any>(null);
    const { handleAuthAction } = useRequireAuth();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

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

    useEffect(() => {
        const handleOpenChat = (e: any) => {
            if (e.detail) {
                setSelectedVendor(e.detail);
                setIsChatOpen(true);
            }
        };
        window.addEventListener('openChat', handleOpenChat);
        return () => window.removeEventListener('openChat', handleOpenChat);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('scroll', checkScroll);
            checkScroll();
            // Also check on resize
            window.addEventListener('resize', checkScroll);
            return () => {
                el.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, []);


    return (
        <div>
            {/* The individual gallery items */}

            <div className="space-y-4 py-8 px-4 sm:px-0 relative group/ads">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] uppercase tracking-tight flex items-center gap-3">
                        <span className="bg-gradient-to-tr from-teal-600 via-emerald-600 to-lime-500 w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" /></svg>
                        </span>
                        Featured Ads
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="hidden sm:inline-block text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 px-3 py-1.5 rounded-full">Top Vendors</span>
                        {/* Navigation Arrows */}
                        <div className="flex gap-1 ml-2">
                            <button
                                onClick={() => scroll('left')}
                                disabled={!showLeftArrow}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-color)] transition-all ${showLeftArrow ? 'bg-[var(--card-bg)] text-[var(--foreground)] opacity-100 hover:scale-110 active:scale-95' : 'bg-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                            </button>
                            <button
                                onClick={() => scroll('right')}
                                disabled={!showRightArrow}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border border-[var(--border-color)] transition-all ${showRightArrow ? 'bg-[var(--card-bg)] text-[var(--foreground)] opacity-100 hover:scale-110 active:scale-95' : 'bg-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory"
                >
                    {shops.map((shop, idx) => (
                        <div
                            key={shop.id}
                            className="flex-none w-[240px] sm:w-[280px] h-[380px] sm:h-[480px] relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer transition-transform hover:scale-[1.02] snap-start"
                        >
                            <img
                                src={idx === 0 ? "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80" : 
                                     idx === 1 ? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80" :
                                     "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80"}
                                alt={shop.shop_name}
                                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                            />
                            {/* Glass Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 dark:to-black/90 to-black/50 flex flex-col justify-end p-6 sm:p-8">
                                <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                                    <div className="p-[2px] rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[var(--background)] overflow-hidden glass-card">
                                            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${shop.shop_name}&backgroundColor=059669`} className="w-full h-full" alt="" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-[var(--foreground)] font-black text-base sm:text-lg tracking-tight leading-none">{shop.shop_name}</h3>
                                        <p className="text-[8px] sm:text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">Verified Vendor</p>
                                    </div>
                                </div>
                                <p className="text-[var(--text-muted)] text-xs sm:text-sm font-medium line-clamp-2 mb-4 sm:mb-6 leading-snug">
                                    {shop.description}
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAuthAction(() => window.location.href = `/shops/${shop.shop_slug || shop.id}`);
                                        }}
                                        className="flex-1 py-2.5 sm:py-3 bg-[var(--foreground)] text-[var(--background)] rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-lg active:scale-95"
                                    >
                                        Enter Shop
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAuthAction(() => { });
                                        }}
                                        className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--foreground)]/10 backdrop-blur-xl border border-[var(--foreground)]/20 text-[var(--foreground)] rounded-xl sm:rounded-2xl flex items-center justify-center"
                                    >
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                    </button>
                                    <button
                                        onClick={() => handleAuthAction(async () => {
                                            if (!shop.vendor_user_id && !shop.id) return;
                                            try {
                                                const conv = await chatService.getOrCreateConversation(shop.vendor_user_id || shop.id);
                                                router.push(`/messages?convId=${conv.id}`);
                                            } catch (err) {
                                                console.error("Chat redirection failed:", err);
                                            }
                                        })}
                                        className="py-1.5 px-3 bg-white/20 backdrop-blur-md rounded-lg text-[9px] font-black uppercase text-white border border-white/20 hover:bg-emerald-600 transition-all"
                                    >
                                        Chat
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ChatOverlay isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} selectedUser={selectedVendor} />
        </div>
    );
};


// Mobile Bottom Nav for that Marketplace App feel
export const MobileBottomNav = () => {
    const { user } = useAuth();
    const router = useRouter();
    const { handleAuthAction } = useRequireAuth();
    const { cartCount } = useCart();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-[var(--background)]/95 backdrop-blur-2xl border-t border-[var(--border-color)] flex justify-between items-center px-8 py-3 z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <Link href="/" className="text-[var(--foreground)] hover:text-emerald-500 transition-colors">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a2 2 0 002 2h2a2 2 0 002-2v-2a1 1 0 112 0v2a2 2 0 002 2h2a2 2 0 002-2v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                </Link>
                
                <button 
                    onClick={() => handleAuthAction(() => setIsSearchOpen(true))}
                    className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>

                <button 
                    onClick={() => handleAuthAction(() => setIsUploadOpen(true))}
                    className="text-[var(--foreground)] p-[2px] bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
                >
                    <div className="bg-[var(--background)] rounded-[10px] p-1.5">
                        <svg className="w-5 h-5 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                </button>

                <button 
                    onClick={() => router.push('/cart')}
                    className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors relative group"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--background)]">
                            {cartCount}
                        </span>
                    )}
                </button>

                <Link href={user ? (user.role === 'VENDOR' ? "/vendor/dashboard" : "/profile") : "/login"}>
                    <div className={`w-7 h-7 rounded-full overflow-hidden border ${user ? 'border-emerald-500' : 'border-[var(--border-color)]'} flex items-center justify-center bg-[var(--card-bg)] hover:scale-110 transition-transform`}>
                        {user ? (
                            <span className="text-[10px] font-black text-emerald-500 uppercase">{user.username[0]}</span>
                        ) : (
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        )}
                    </div>
                </Link>
            </div>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <QuickSellModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </>
    );
};

// AI Shop Assistant: Branded floating support/search button
export const AIShopAssistant = () => {
    const { user } = useAuth();
    const { handleAuthAction } = useRequireAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-24 right-6 z-[100] md:bottom-10 md:right-10 flex flex-col items-end gap-4">
            {/* Quick Actions Menu */}
            {isOpen && (
                <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl p-6 min-w-[240px] animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-4 px-2">CMart Assistant</h4>
                    <div className="space-y-2">
                        {(!user || user.role === 'BUYER') && (
                            <button 
                                onClick={() => handleAuthAction(() => window.location.href = '/cart')}
                                className="w-full flex items-center gap-4 p-4 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-2xl transition-all group text-left"
                            >
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-tight">Process Payment</p>
                                    <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Secure Checkout</p>
                                </div>
                            </button>
                        )}
                        <button 
                             onClick={() => handleAuthAction(() => {
                                // This could open the chat list or a specific support chat
                                window.dispatchEvent(new CustomEvent('openChat', { detail: { username: 'CMart Support', id: 'system' } }));
                                setIsOpen(false);
                            })}
                            className="w-full flex items-center gap-4 p-4 hover:bg-teal-50 dark:hover:bg-teal-950/30 rounded-2xl transition-all group text-left"
                        >
                            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            </div>
                            <div>
                                <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-tight">Chat with Vendors</p>
                                <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">Direct Messaging</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative group outline-none"
            >
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden sm:block pointer-events-none">
                    <div className="bg-[var(--foreground)] text-[var(--background)] text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl shadow-2xl">
                        AI Shopping Assistant
                    </div>
                </div>

                {/* Button Body */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-2xl transition-all outline-none ${isOpen ? 'bg-emerald-600 rotate-90 scale-110' : 'bg-[var(--foreground)] hover:scale-110 active:scale-95 shadow-emerald-500/40'}`}>
                    <div className="relative">
                        {isOpen ? (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <span className="text-[var(--background)] font-black text-2xl sm:text-3xl">C</span>
                        )}
                        {/* Pulsing Notification Dot */}
                        {!isOpen && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[var(--foreground)] animate-pulse"></span>}
                    </div>
                </div>
            </button>
        </div>
    );
};
