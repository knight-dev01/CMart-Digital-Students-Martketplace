'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productService } from '@/services/product';
import { chatService } from '@/services/chat';
import { ProductAd } from '@/components/SocialEngagement';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { LoadingScreen } from '@/components/LoadingScreen';
import Link from 'next/link';

export default function ShopProfilePage() {
    const { slug } = useParams();
    const router = useRouter();
    const { handleAuthAction } = useRequireAuth();
    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleChat = async () => {
        if (!shop?.vendor?.id) return;
        try {
            const conv = await chatService.getOrCreateConversation(shop.vendor.id);
            router.push(`/messages?convId=${conv.id}`);
        } catch (err) {
            console.error('Chat redirection failed:', err);
        }
    };

    useEffect(() => {
        const fetchShopData = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const shopData = await productService.getShopBySlug(slug as string);
                setShop(shopData);
                
                const shopProducts = await productService.getProductsByShop(slug as string);
                setProducts(shopProducts);
            } catch (err) {
                console.error('Failed to fetch shop data:', err);
                setError('Shop not found or failed to load.');
            } finally {
                setLoading(false);
            }
        };

        fetchShopData();
    }, [slug]);

    if (loading) return <LoadingScreen message="Loading Student Shop..." />;

    if (error || !shop) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Shop Not Found</h1>
                <p className="text-[var(--text-muted)] mb-8 font-bold uppercase tracking-widest text-xs">{error || 'This shop might have relocated or closed.'}</p>
                <Link href="/" className="px-8 py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">
                    Return to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24 font-sans">
            {/* Shop Header (Premium Instagram-Style) */}
            <div className="relative pt-24 pb-12 px-4 sm:px-8 border-b border-[var(--border-color)] overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-teal-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 relative z-10">
                    {/* Circle Profile Image */}
                    <div className="flex-none">
                        <div className="p-[3px] rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400 shadow-2xl shadow-emerald-500/10">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[var(--background)] overflow-hidden bg-[var(--card-bg)]">
                                <img 
                                    src={shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.shop_name}&backgroundColor=059669`} 
                                    className="w-full h-full object-cover" 
                                    alt={shop.shop_name} 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Shop Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                            <h1 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight uppercase">{shop.shop_name}</h1>
                            <div className="flex items-center justify-center gap-2">
                                <button className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                                    Follow
                                </button>
                                <button 
                                    onClick={() => handleAuthAction(handleChat)}
                                    className="px-4 py-2 bg-[var(--foreground)]/10 backdrop-blur-xl border border-[var(--border-color)] text-[var(--foreground)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--foreground)]/20 transition-all"
                                >
                                    Message
                                </button>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-center md:justify-start gap-8 mb-6">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-lg font-black text-[var(--foreground)] leading-none">{products.length}</span>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Listings</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-lg font-black text-[var(--foreground)] leading-none">{shop.followers?.length || 0}</span>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Followers</span>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <div className="flex items-center gap-1.5 leading-none">
                                    <span className={`w-2 h-2 rounded-full ${shop.vendor?.is_verified ? 'bg-emerald-500' : 'bg-gray-400 opacity-30 animate-pulse'}`}></span>
                                    <span className="text-lg font-black text-[var(--foreground)]">
                                        {shop.vendor?.is_verified ? 'Verified' : 'Under Review'}
                                    </span>
                                </div>
                                <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">Student Shop</span>
                            </div>
                        </div>

                        <p className="text-sm font-medium text-[var(--foreground)]/80 leading-relaxed max-w-lg mx-auto md:mx-0">
                            {shop.description || 'Welcome to our shop! We offer the best quality items for fellow students. Reach out for any inquiries! 🔥'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Shop Content (Grid vs List) */}
            <main className="max-w-4xl mx-auto px-4 mt-8">
                {/* Tabs Wrapper */}
                <div className="flex justify-center border-t border-[var(--border-color)] mb-8">
                    <button className="px-8 py-4 border-t-2 border-[var(--foreground)] -mt-[1px] flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--foreground)]">Store Listings</span>
                    </button>
                    <button className="px-8 py-4 border-t border-transparent text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">About Vendor</span>
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className="py-20 text-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-[var(--border-color)] flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 11-8 0m-4 8a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6z" /></svg>
                        </div>
                        <p className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">No products listed yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                        {products.map(product => (
                            <ProductAd key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
