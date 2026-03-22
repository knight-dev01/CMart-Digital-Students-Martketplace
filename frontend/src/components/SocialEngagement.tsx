'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { chatService } from '@/services/chat';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { ChatOverlay } from './ChatComponent';

interface Shop {
    id: number;
    shop_name: string;
    shop_slug?: string;
    description?: string;
    logo?: string;
    vendor_user_id?: number;
}

// Featured Shops (Circles at the top)
export const FeaturedShops = ({ shops }: { shops: Shop[] }) => (
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

// ProductAd logic removed - use ProductCard.tsx instead

export const FeaturedAds = ({ shops }: { shops: Shop[] }) => {
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
        const handleOpenChat = (e: Event) => {
            const detail = (e as CustomEvent).detail;
            if (detail) {
                setSelectedVendor(detail);
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
                    className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
                >
                    {shops.map((shop, idx) => (
                        <div
                            key={shop.id}
                            className="flex-none w-[240px] sm:w-[280px] h-[360px] sm:h-[420px] relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl group cursor-pointer transition-transform hover:scale-[1.02] snap-start"
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


// MobileBottomNav definition removed - use MobileBottomNav.tsx instead

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
