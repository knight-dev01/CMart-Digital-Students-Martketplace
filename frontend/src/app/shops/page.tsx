'use client';

import React, { useState, useEffect } from 'react';
import { productService } from '@/services/product';
import { StudentShopCard } from '@/components/StudentShopCard';
import Link from 'next/link';

export default function ShopsPage() {
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCampus, setSelectedCampus] = useState('All Campuses');

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const data = await productService.getShops();
                setShops(data);
            } catch (error) {
                console.error("Failed to fetch shops:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const campuses = ['All Campuses', 'Trinity University', 'UNILAG', 'OAU', 'UI', 'LASU', 'UNIBEN'];

    const filteredShops = shops.filter(shop => {
        const matchesSearch = shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (shop.description && shop.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCampus = selectedCampus === 'All Campuses' || shop.university === selectedCampus;
        return matchesSearch && matchesCampus;
    });

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-5xl sm:text-7xl font-black text-[var(--foreground)] uppercase tracking-tighter leading-none">
                        Student <span className="text-emerald-500">Vendors</span>
                    </h1>
                    <p className="text-[10px] sm:text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.4em]">
                        Discover and support the best student entrepreneurs on campus
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-[var(--card-bg)] p-4 rounded-[2.5rem] border border-[var(--border-color)] shadow-xl">
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search for a shop or product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none px-6 py-3 outline-none font-bold text-[var(--foreground)] placeholder:text-[var(--text-muted)] placeholder:opacity-50"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>

                    <div className="h-8 w-[1px] bg-[var(--border-color)] hidden md:block"></div>

                    <div className="flex items-center gap-2 w-full md:w-auto px-4">
                        <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">Filter by:</span>
                        <select 
                            value={selectedCampus}
                            onChange={(e) => setSelectedCampus(e.target.value)}
                            className="bg-transparent border-none font-black text-[10px] uppercase tracking-widest text-emerald-500 outline-none cursor-pointer"
                        >
                            {campuses.map(campus => (
                                <option key={campus} value={campus} className="bg-[var(--card-bg)] text-[var(--foreground)]">
                                    {campus}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Shop Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-[var(--card-bg)] h-80 rounded-[2.5rem] animate-pulse"></div>
                        ))}
                    </div>
                ) : filteredShops.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredShops.map(shop => (
                            <StudentShopCard key={shop.id} shop={shop} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[var(--card-bg)] rounded-[3rem] border border-dashed border-[var(--border-color)]">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight mb-2">No Shops Found</h3>
                        <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Become a Vendor CTA */}
                <div className="mt-20 p-12 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[3.5rem] text-center text-white shadow-2xl shadow-emerald-500/20">
                    <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">Start Your Own Campus Shop?</h2>
                    <p className="text-sm font-medium opacity-90 max-w-xl mx-auto mb-8">
                        Join hundreds of student entrepreneurs today. Sell products, reach more students, and build your brand.
                    </p>
                    <Link 
                        href="/vendor/setup"
                        className="inline-block px-10 py-5 bg-white text-emerald-700 rounded-3xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl"
                    >
                        Register as a Vendor
                    </Link>
                </div>
            </div>
        </div>
    );
}
