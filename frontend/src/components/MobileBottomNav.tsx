'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { SearchOverlay } from './SearchOverlay';
import { QuickSellModal } from './QuickSellModal';

export const MobileBottomNav = () => {
    const { user } = useAuth();
    const { handleAuthAction } = useRequireAuth();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-[var(--background)]/95 backdrop-blur-2xl border-t border-[var(--border-color)] flex justify-between items-center px-8 py-3 z-50 md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <Link href="/" className="text-[var(--foreground)] hover:text-emerald-500 transition-colors" title="Marketplace">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a2 2 0 002 2h2a2 2 0 002-2v-2a1 1 0 112 0v2a2 2 0 002 2h2a2 2 0 002-2v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                </Link>
                
                <button 
                    onClick={() => handleAuthAction(() => setIsSearchOpen(true))}
                    className="text-[var(--text-muted)] hover:text-emerald-500 transition-colors"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>

                <button 
                    onClick={() => handleAuthAction(() => setIsUploadOpen(true))}
                    className="text-[var(--foreground)] p-[2px] bg-gradient-to-tr from-teal-400 via-emerald-500 to-lime-400 rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition-all"
                >
                    <div className="bg-[var(--background)] rounded-[10px] p-1.5">
                        <svg className="w-5 h-5 text-[var(--foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                </button>

                <button 
                    onClick={() => handleAuthAction(() => window.location.href = '/favorites')}
                    className="text-[var(--text-muted)] hover:text-red-500 transition-colors"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>

                <Link href={user ? (user.role === 'VENDOR' ? "/vendor/dashboard" : "/profile") : "/login"}>
                    <div className={`w-7 h-7 rounded-full overflow-hidden border ${user ? 'border-emerald-500' : 'border-[var(--border-color)]'} flex items-center justify-center bg-[var(--card-bg)] hover:scale-110 transition-transform`}>
                        {user ? (
                            <span className="text-[10px] font-black text-emerald-500 uppercase">{user.username[0]}</span>
                        ) : (
                            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        )}
                    </div>
                </Link>
            </div>

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <QuickSellModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </>
    );
};
