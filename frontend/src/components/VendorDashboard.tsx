'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export const VendorDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight">Vendor Dashboard</h1>
                            <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[8px] font-black px-2 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/20">
                                Official Shop
                            </span>
                        </div>
                        <p className="text-[var(--text-muted)] mt-2 font-medium">Welcome back, <span className="text-emerald-500 font-bold">@{user?.username}</span>. Manage your campus shop and sales.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/products/create"
                            className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            Add New Product
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}

                {/* Wallet & Transaction Section */}
                <div className="bg-[var(--card-bg)] rounded-[2.5rem] border border-[var(--border-color)] overflow-hidden shadow-sm">
                    <div className="border-b border-[var(--border-color)] px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                            {['My Products', 'Order History', 'Shop Settings', 'Wallet'].map((tab, i) => (
                                <button
                                    key={i}
                                    className={`text-[10px] font-black uppercase tracking-widest pb-2 whitespace-nowrap transition-all ${tab === 'Wallet' ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-[var(--text-muted)] hover:text-emerald-400'}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-2xl border border-emerald-100 dark:border-emerald-900/50">
                            <div className="text-right">
                                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Available Balance</p>
                                <p className="text-lg font-black text-emerald-600">₦118,750</p>
                            </div>
                            <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">Withdraw</button>
                        </div>
                    </div>

                    <div className="p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight">Recent Payouts & Commissions</h3>
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 dark:bg-red-900/10 px-3 py-1.5 rounded-full border border-red-100 dark:border-red-900/50">5% Platform Fee Applied</span>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: '#ORD-1024', name: 'Vintage Denim Jacket', buyer: 'Adegoke', gross: 5000, fee: 250, net: 4750, status: 'Settled', date: 'Today, 2:45 PM' },
                                { id: '#ORD-1023', name: 'Student Essentials Pack', buyer: 'Funmi', gross: 12500, fee: 625, net: 11875, status: 'Settled', date: 'Yesterday' },
                                { id: '#ORD-1022', name: 'Laptop Stand (Aluminum)', buyer: 'Tope', gross: 8000, fee: 400, net: 7600, status: 'Settled', date: 'Mar 08' },
                            ].map((tx) => (
                                <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-[var(--background)] rounded-3xl border border-[var(--border-color)] group hover:border-emerald-500/30 transition-all gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-xl">📦</div>
                                        <div>
                                            <h4 className="text-xs font-black text-[var(--foreground)] uppercase tracking-tight">{tx.name}</h4>
                                            <p className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-0.5">{tx.id} • {tx.buyer}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-8 sm:gap-12">
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-1">Gross Sale</p>
                                            <p className="text-xs font-black text-[var(--foreground)]">₦{tx.gross.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-red-400 uppercase tracking-widest mb-1">Fee (5%)</p>
                                            <p className="text-xs font-black text-red-400">-₦{tx.fee.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-green-500 uppercase tracking-widest mb-1">Vendor Net</p>
                                            <p className="text-sm font-black text-green-500">₦{tx.net.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right min-w-[80px]">
                                            <span className="text-[8px] font-black bg-green-50 dark:bg-green-900/20 text-green-500 px-2.5 py-1 rounded-full uppercase tracking-widest border border-green-100 dark:border-green-900/50">{tx.status}</span>
                                            <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-2">{tx.date}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
