'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { productService } from '@/services/product';
import { chatService } from '@/services/chat';

export const ProductCard = ({ product, variant = 'default' }: { product: any, variant?: 'default' | 'compact' }) => {
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

    if (variant === 'compact') {
        return (
            <div className="flex-none w-[220px] bg-[var(--card-bg)] rounded-[2.5rem] overflow-hidden border border-[var(--border-color)] group hover:shadow-xl transition-all">
                <Link href={`/products/${product.id}`} className="block h-40 overflow-hidden relative">
                    <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full text-[9px] font-black">
                        ₦{product.price.toLocaleString()}
                    </div>
                </Link>
                <div className="p-4">
                    <h4 className="text-xs font-black text-[var(--foreground)] truncate uppercase tracking-tight">{product.name}</h4>
                    <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">{product.shop_name}</p>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                        }}
                        className="mt-4 w-full py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all opacity-0 group-hover:opacity-100"
                    >
                        Quick Add
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full glass-card sm:rounded-[2.5rem] overflow-hidden mb-4 sm:mb-8 font-sans shadow-2xl shadow-emerald-500/5 transition-all relative">
            {showCopiedBadge && (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-2xl border border-emerald-400/30">
                        Link Copied!
                    </div>
                </div>
            )}
            
            <div className="flex items-center justify-between p-4 px-4 sm:px-6">
                <div className="flex items-center space-x-3">
                    <div className="p-[1px] rounded-full bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400">
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[var(--background)]">
                            <img src={product.shop_logo || `https://api.dicebear.com/7.x/initials/svg?seed=${product.shop_name}&backgroundColor=059669`} alt="" />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-[var(--foreground)] leading-none">{product.shop_name}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest leading-none">Campus Campus</p>
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
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" />
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

            <div className="p-4 px-4 sm:px-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => handleAuthAction(handleLike)} className={`${isLiked ? 'text-red-500 scale-110' : 'text-[var(--foreground)]'} hover:text-red-500 transition-all active:scale-95`}>
                            <svg className="w-7 h-7" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                        <button onClick={() => handleAuthAction(handleChat)} className="text-[var(--foreground)] hover:text-[#10b981] transition-colors">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </button>
                        <button onClick={handleShare} className="text-[var(--foreground)] hover:text-emerald-600 transition-colors">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        </button>
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-black text-[var(--foreground)]">{likesCount} students like this</p>
                    <div className="text-sm">
                        <Link href={`/shops/${product.shop_slug || product.vendor_id}`} className="font-black text-[var(--foreground)] mr-2 hover:text-emerald-500 transition-colors">{product.shop_name}</Link>
                        <Link href={`/products/${product.id}`} className="text-[var(--text-muted)] font-medium leading-relaxed hover:text-[var(--foreground)] transition-colors">{product.name} — fresh campus drop! 🔥</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
