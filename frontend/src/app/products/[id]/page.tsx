'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { productService } from '@/services/product';
import { chatService } from '@/services/chat';
import { useCart } from '@/components/CartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [showCopiedBadge, setShowCopiedBadge] = useState(false);
    
    const { addToCart } = useCart();
    const { handleAuthAction } = useRequireAuth();

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                try {
                    const data = await productService.getProductById(Array.isArray(id) ? id[0] : id);
                    setProduct(data);
                    setIsLiked(data.is_liked || false);
                    setLikesCount(data.likes_count || 0);
                    setLoading(false);
                } catch (err) {
                    console.error("Fetch product failed:", err);
                    setLoading(false);
                }
            }
        };
        fetchProduct();
    }, [id]);

    const handleLike = async () => {
        try {
            await productService.likeProduct(product.id);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (err) {
            console.error("Liking failed:", err);
        }
    };

    const handleShare = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        setShowCopiedBadge(true);
        setTimeout(() => setShowCopiedBadge(false), 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] p-4">
                <h1 className="text-2xl font-black text-[var(--foreground)] uppercase mb-4">Product Not Found</h1>
                <Link href="/" className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="bg-[var(--card-bg)] rounded-[3rem] overflow-hidden border border-[var(--border-color)] aspect-square shadow-2xl relative group">
                        <img 
                            src={product.images?.[0]?.image || 'https://via.placeholder.com/600?text=Product'} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded-full font-black text-sm shadow-xl">
                            ₦{Number(product.price).toLocaleString()}
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/50">
                                    {product.category || 'Uncategorized'}
                                </span>
                                {product.is_verified && (
                                    <span className="text-[10px] font-black bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full uppercase tracking-widest border border-teal-100 dark:border-teal-900/50">
                                        Verified Item
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-[var(--foreground)] uppercase tracking-tight leading-none mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <span className="text-emerald-600 font-black text-xs uppercase">{product.shop_name?.[0]}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-tight">{product.shop_name}</p>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Campus Shop</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border-color)] shadow-sm">
                            <h3 className="text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-4">About this item</h3>
                            <p className="text-[var(--foreground)] font-medium leading-relaxed">
                                {product.description || "No description provided for this campus drop."}
                            </p>
                        </div>

                        <div className="flex gap-4 relative">
                            {/* Copied Badge */}
                            {showCopiedBadge && (
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                                        Link Copied!
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={() => addToCart(product)}
                                className="flex-1 py-5 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 active:scale-95"
                            >
                                Add to Basket
                            </button>
                            <button 
                                onClick={() => handleAuthAction(async () => {
                                    if (!product?.vendor_id) return;
                                    try {
                                        const conv = await chatService.getOrCreateConversation(product.vendor_id);
                                        router.push(`/messages?convId=${conv.id}`);
                                    } catch (err) {
                                        console.error("Chat init failed:", err);
                                    }
                                })}
                                className="flex-1 py-5 bg-[var(--foreground)]/10 backdrop-blur-xl border border-[var(--border-color)] text-[var(--foreground)] rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-[var(--foreground)]/20 transition-all active:scale-95"
                            >
                                Chat with Vendor
                            </button>
                            <button 
                                onClick={() => handleAuthAction(handleLike)}
                                className={`w-16 h-16 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl flex items-center justify-center transition-all active:scale-95 ${isLiked ? 'text-red-500 border-red-200' : 'text-[var(--foreground)]'}`}
                            >
                                <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                            </button>
                            <button 
                                onClick={handleShare}
                                className="w-16 h-16 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl flex items-center justify-center text-[var(--foreground)] hover:text-emerald-500 transition-colors active:scale-95"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-6 px-4">
                            <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-tight">{likesCount} Students like this</p>
                            <span className="w-1 h-1 bg-[var(--border-color)] rounded-full"></span>
                            <p className="text-xs font-black text-[var(--foreground)] uppercase tracking-tight">{product.view_count || 0} Views</p>
                        </div>

                        <div className="flex items-center gap-4 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/50">
                            <div className="w-12 h-12 bg-white dark:bg-emerald-800 rounded-2xl flex items-center justify-center shadow-sm">
                                <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-1">Safe Escrow Guaranteed</h4>
                                <p className="text-[9px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-tight leading-tight">Funds are only released to vendor after you confirm delivery.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
