'use client';

import React, { useState, useEffect } from 'react';
import { productService } from '@/services/product';
import Link from 'next/link';

export const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ products: any[], shops: any[] }>({ products: [], shops: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults({ products: [], shops: [] });
            return;
        }

        const delayDebounce = setTimeout(async () => {
            setLoading(true);
            try {
                // We'll add a new method to productService or use fetch directly
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/search/?q=${query}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[var(--background)] z-[200] animate-in fade-in slide-in-from-bottom-10 duration-300">
            <div className="max-w-2xl mx-auto h-full flex flex-col">
                {/* Search Header */}
                <div className="p-4 flex items-center gap-4 border-b border-[var(--border-color)]">
                    <button onClick={onClose} className="p-2 text-[var(--foreground)]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7 7-7" /></svg>
                    </button>
                    <div className="flex-1 relative">
                        <input
                            autoFocus
                            type="text"
                            placeholder="Search products, vendors..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl px-6 py-3 outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-bold"
                        />
                        {loading && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-8 pb-24">
                    {query && results.products.length === 0 && results.shops.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-xs">No results found for "{query}"</p>
                        </div>
                    )}

                    {results.products.length > 0 && (
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 ml-2">Product Results</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {results.products.map(product => (
                                    <Link key={product.id} href={`/products/${product.id}`} onClick={onClose} className="glass-card rounded-2xl overflow-hidden group">
                                        <div className="aspect-square bg-[var(--border-color)]/20 relative">
                                            <img src={product.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80'} className="w-full h-full object-cover" alt="" />
                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full">
                                                <span className="text-[10px] font-black text-white">₦{Number(product.price).toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs font-black text-[var(--foreground)] truncate">{product.name}</p>
                                            <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1">{product.shop_name}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {results.shops.length > 0 && (
                        <section>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-4 ml-2">Vendor Results</h3>
                            <div className="space-y-3">
                                {results.shops.map(shop => (
                                    <Link key={shop.id} href={`/shops/${shop.id}`} onClick={onClose} className="flex items-center gap-4 p-4 glass-card rounded-2xl hover:border-emerald-500/50 transition-colors group">
                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[var(--border-color)] group-hover:border-emerald-500 transition-colors">
                                            <img src={shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.shop_name}&backgroundColor=059669`} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-[var(--foreground)]">{shop.shop_name}</p>
                                            <p className="text-[10px] font-medium text-[var(--text-muted)] line-clamp-1">{shop.description}</p>
                                        </div>
                                        <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-emerald-500 translate-x-0 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}

                    {!query && (
                        <div className="py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </div>
                            <h4 className="text-lg font-black text-[var(--foreground)] uppercase tracking-tight">Unified Campus Search</h4>
                            <p className="text-xs text-[var(--text-muted)] font-bold max-w-[200px] mx-auto leading-relaxed uppercase tracking-widest">Discover items and trusted vendors in your university today.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
