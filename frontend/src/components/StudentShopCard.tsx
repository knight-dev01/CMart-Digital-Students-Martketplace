'use client';

import React from 'react';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Shop } from '@/types';

// Student Shop Card: Trust and social focused
export const StudentShopCard = ({ shop }: { shop: Shop }) => {
    const { handleAuthAction } = useRequireAuth();

    return (
        <div className="bg-[var(--card-bg)] rounded-3xl p-5 sm:p-6 border border-[var(--border-color)] shadow-sm hover:shadow-xl transition-all text-center group">
            <div className="relative inline-block">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-emerald-50 dark:border-emerald-900/20 group-hover:border-emerald-100 dark:group-hover:border-emerald-800 transition-colors mx-auto">
                    <img src={shop.logo || 'https://via.placeholder.com/150?text=Shop'} alt={shop.shop_name} className="w-full h-full object-cover" />
                </div>
                {shop.is_verified && (
                    <div className="absolute bottom-0 right-0 bg-[var(--background)] rounded-full p-1 shadow-sm">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    </div>
                )}
            </div>
            <h3 className="mt-4 sm:mt-5 text-lg sm:text-xl font-black text-[var(--foreground)] uppercase tracking-tight">{shop.shop_name}</h3>
            <p className="text-[var(--text-muted)] text-xs sm:text-sm line-clamp-2 mt-2 font-medium px-2">{shop.description}</p>
            <div className="mt-4 flex items-center justify-center space-x-3 sm:space-x-4 text-[10px] sm:text-[11px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1">
                    <span className="text-[var(--foreground)]">{shop.followers_count || 0}</span> Followers
                </span>
                <span className="w-1 h-1 bg-[var(--border-color)] rounded-full"></span>
                <span className="flex items-center gap-1">
                    <span className="text-[var(--foreground)]">{shop.product_count || 0}</span> Items
                </span>
            </div>
            <button
                onClick={() => handleAuthAction(() => window.location.href = `/shops/${shop.shop_slug || shop.id}`)}
                className="mt-6 w-full py-3 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#10b981] hover:text-white transition-all shadow-lg active:scale-95"
            >
                Visit Student Shop
            </button>
        </div>
    );
};
