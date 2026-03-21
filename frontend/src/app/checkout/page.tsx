'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { useRouter } from 'next/navigation';
import { orderService } from '@/services/order';
import { paymentService } from '@/services/payment';
import api from '@/services/api';

export default function CheckoutPage() {
    const { cart, totalPrice, clearCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handlePlaceOrder = async () => {
        setIsProcessing(true);
        try {
            // 1. Sync local cart to server securely
            await api.post('/orders/cart/sync/', { items: cart });
            
            // 2. Checkout to create an Order
            const order = await orderService.checkout();
            
            // 3. Initialize Paystack Transaction
            const callbackUrl = `${window.location.origin}/checkout/verify`;
            const paymentData = await paymentService.initializePayment(order.id, callbackUrl);
            
            // 4. Clear local cart
            clearCart();
            
            // 5. Redirect to Paystack
            window.location.href = paymentData.authorization_url;
            
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Payment setup failed. Please try again.");
            setIsProcessing(false);
        }
    };

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center bg-[var(--background)]">
                <div>
                    <h2 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">No items for checkout</h2>
                    <Link href="/" className="text-emerald-500 font-black uppercase text-xs tracking-widest hover:underline">Return to Marketplace</Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
                <div className="max-w-md w-full bg-[var(--card-bg)] rounded-[3rem] p-12 text-center shadow-2xl border border-emerald-100 dark:border-emerald-900/50">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce transition-all">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Order Received!</h2>
                    <p className="text-[var(--text-muted)] font-medium mb-10 leading-relaxed">Your order has been placed successfully. Our escrow system will secure your funds until delivery is confirmed.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-12">Secure Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div className="space-y-8">
                        <div className="bg-[var(--card-bg)] p-8 rounded-[2rem] border border-[var(--border-color)]">
                            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-6">Delivery Details</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Campus Hostel/Address</label>
                                    <input type="text" placeholder="e.g Honesty Hall, Room 204" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-4 text-xs font-bold outline-none focus:border-emerald-500 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone Number</label>
                                    <input type="tel" placeholder="081XXXXXXX" className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-xl p-4 text-xs font-bold outline-none focus:border-emerald-500 transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--card-bg)] p-8 rounded-[2rem] border border-[var(--border-color)] opacity-60">
                            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Payment Method</h3>
                            <div className="flex items-center gap-4 p-4 border-2 border-emerald-600 rounded-2xl bg-emerald-50/10">
                                <div className="w-5 h-5 rounded-full border-4 border-emerald-600"></div>
                                <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">Paystack (Cards / Transfer)</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-[var(--card-bg)] p-8 rounded-[3rem] border border-[var(--border-color)] h-fit shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 bg-emerald-500/5 rounded-full -mr-4 -mt-4"></div>
                        <h3 className="text-lg font-black text-[var(--foreground)] uppercase tracking-tight mb-8">Purchase Summary</h3>

                        <div className="space-y-4 mb-10">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                <span>Items Subtotal</span>
                                <span>₦{totalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                                <span>Campus Delivery</span>
                                <span>₦500</span>
                            </div>
                            <div className="pt-6 border-t border-[var(--border-color)] flex justify-between">
                                <span className="text-xs font-black uppercase tracking-widest text-[var(--foreground)]">Final Order Total</span>
                                <span className="text-2xl font-black text-emerald-600">₦{(totalPrice + 500).toLocaleString()}</span>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={isProcessing}
                            className={`w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${isProcessing ? 'bg-emerald-300 cursor-wait' : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-2xl shadow-emerald-500/30 text-white'}`}
                        >
                            {isProcessing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing Securely...
                                </span>
                            ) : (
                                "Pay Now with SafeEscrow"
                            )}
                        </button>

                        <div className="mt-8">
                            <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                <p className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight leading-tight">Your funds are kept in escrow until you confirm receipt of order.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
