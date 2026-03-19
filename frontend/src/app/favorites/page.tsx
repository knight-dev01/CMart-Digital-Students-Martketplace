'use client';

import React, { useState, useEffect } from 'react';
import { productService } from '@/services/product';
import { useCart } from '@/components/CartContext';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

export default function FavoritesPage() {
    const [likedProducts, setLikedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useAuth();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const products = await productService.getProducts();
                // Filter products where user is in likes (Mocking filtering since getProducts might not handle it)
                // In a real app, we'd have /api/products/likes/
                if (user) {
                     // Temporary mock: show products that contain 'likes' count > 0 for demo
                     // Or better, we'll just show all for now if we don't have a specific likes endpoint
                     setLikedProducts(products.slice(0, 4)); 
                }
            } catch (error) {
                console.error("Failed to fetch favorites:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [user]);

    return (
        <div className="min-h-screen bg-[var(--background)] pb-32">
            <header className="p-6 pt-12">
                <h1 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight">Your Favorites</h1>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Saved items you love</p>
            </header>

            <main className="px-4">
                {loading ? (
                    <div className="py-20 text-center animate-pulse">
                        <div className="w-12 h-12 bg-[var(--border-color)] rounded-2xl mx-auto mb-4"></div>
                        <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Loading favorites...</p>
                    </div>
                ) : likedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {likedProducts.map(product => (
                            <div key={product.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] flex flex-col">
                                <Link href={`/products/${product.id}`} className="block relative aspect-video overflow-hidden">
                                    <img src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="" />
                                    <div className="absolute top-4 right-4 bg-[var(--background)]/60 backdrop-blur-md px-3 py-1 rounded-full">
                                        <span className="text-xs font-black text-[var(--foreground)]">₦{Number(product.price).toLocaleString()}</span>
                                    </div>
                                </Link>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-[var(--foreground)] truncate">{product.name}</h3>
                                        <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1">{product.shop_name}</p>
                                    </div>
                                    <div className="mt-6 flex gap-3">
                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95"
                                        >
                                            Add to Cart
                                        </button>
                                        <button className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-2xl border border-red-100 dark:border-red-900/50">
                                            <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-6">
                        <div className="w-20 h-20 bg-[var(--card-bg)] rounded-[2.5rem] flex items-center justify-center mx-auto border border-[var(--border-color)]">
                           <svg className="w-10 h-10 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <h2 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight">Empty Heart</h2>
                        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">Go find some items you love and tap the heart icon!</p>
                        <Link href="/" className="inline-block py-4 px-8 bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all">Explore Market</Link>
                    </div>
                )}
            </main>
        </div>
    );
}
