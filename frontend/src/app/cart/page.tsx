'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { useTheme } from '@/components/ThemeContext';
import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function CartPage() {
    const { cart, cartCount, removeFromCart, updateQuantity, totalPrice } = useCart();
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();
    const { handleAuthAction } = useRequireAuth();

    // Redirect Vendors away from the cart
    React.useEffect(() => {
        if (user && user.role === 'VENDOR') {
            router.push('/vendor/dashboard');
        }
    }, [user, router]);

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] uppercase tracking-tight flex items-center gap-4">
                        <span className="bg-emerald-600 text-white p-2 rounded-2xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </span>
                        Your Basket
                    </h1>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none">Total Items</p>
                        <p className="text-2xl font-black text-[var(--foreground)] mt-1">{cartCount}</p>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border-color)] p-12 sm:p-20 text-center shadow-xl">
                        <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                            <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        </div>
                        <h2 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Your basket is empty</h2>
                        <p className="text-[var(--text-muted)] font-medium mb-10 max-w-sm mx-auto">Looks like you haven't added any campus drops to your basket yet. Go explore the marketplace!</p>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('lastPath');
                                window.location.href = '/';
                            }}
                            className="inline-flex items-center justify-center px-10 py-4 bg-emerald-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20"
                        >
                            Explore Marketplace
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="bg-[var(--card-bg)] rounded-[2rem] border border-[var(--border-color)] overflow-hidden flex items-center p-4 sm:p-6 group relative shadow-md hover:shadow-xl transition-all">
                                    {/* Product Image */}
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-[var(--border-color)]/20 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="ml-6 flex-1 pr-10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[8px] font-black bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-tighter border border-emerald-100 dark:border-emerald-900/50">Verified Shop</span>
                                            <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{item.shop_name}</p>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-black text-[var(--foreground)] leading-tight mb-4">{item.name}</h3>

                                        <div className="flex items-center justify-between">
                                            <p className="text-sm sm:text-base font-black text-emerald-500">₦{Number(item.price).toLocaleString()}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center bg-[var(--background)] rounded-xl border border-[var(--border-color)] p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                    className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-[10px] font-black text-[var(--foreground)]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="absolute top-4 right-4 p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-28 bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border-color)] p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-12 bg-emerald-500/5 -mr-8 -mt-8 rounded-full"></div>

                                <h3 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight mb-8 flex items-center gap-3">
                                    Summary
                                    <span className="h-1 flex-1 bg-[var(--border-color)] rounded-full opacity-30"></span>
                                </h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Subtotal</span>
                                        <span className="text-sm font-black text-[var(--foreground)]">₦{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Delivery Fee</span>
                                        <span className="text-xs font-black text-green-500 uppercase tracking-widest">Calculated at Next Step</span>
                                    </div>
                                    <div className="pt-4 border-t border-[var(--border-color)] flex justify-between">
                                        <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground)] uppercase tracking-widest">Estimated Total</span>
                                        <span className="text-2xl font-black text-emerald-600">₦{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => handleAuthAction(() => router.push('/checkout'))}
                                    className="block w-full text-center py-5 bg-emerald-600 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/30"
                                >
                                    Proceed to Checkout representing CMart
                                </button>

                                <div className="mt-8 flex items-center justify-center gap-4 grayscale opacity-40">
                                    <img src="https://paystack.com/assets/payment/cards.svg" alt="Payments" className="h-6" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
