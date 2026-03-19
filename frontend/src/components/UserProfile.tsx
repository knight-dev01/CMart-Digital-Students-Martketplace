'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export const UserProfile = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = React.useState('activity');

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24 font-sans">
            {/* Profile Header */}
            <div className="relative pt-24 pb-12 border-b border-[var(--border-color)] overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]"></div>
                    <div className="absolute top-1/2 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                        {/* Avatar Section */}
                        <div className="flex-none">
                            <div className="p-1 rounded-[2.5rem] bg-gradient-to-tr from-teal-400 via-emerald-500 to-indigo-500 shadow-2xl">
                                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.2rem] bg-[var(--card-bg)] p-2">
                                    <div className="w-full h-full rounded-[1.8rem] bg-emerald-600 flex items-center justify-center border-4 border-[var(--background)] shadow-inner">
                                        <span className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tighter">
                                            {user?.username?.[0]}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                <h1 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight">
                                    {user?.username}
                                </h1>
                                <div className="flex items-center justify-center gap-2">
                                    <button className="px-6 py-2.5 bg-[var(--foreground)] text-[var(--background)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                                        Edit Profile
                                    </button>
                                    <button 
                                        onClick={logout}
                                        className="p-2.5 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all group"
                                        title="Sign Out"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                    </button>
                                </div>
                            </div>

                            {/* Bio / Status */}
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    {user?.role || 'STUDENT'}
                                </span>
                                <span className="w-1 h-1 bg-[var(--border-color)] rounded-full"></span>
                                <span className="text-sm font-bold text-[var(--text-muted)]">{user?.email}</span>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-8 max-w-sm mx-auto md:mx-0">
                                <div>
                                    <p className="text-xl font-black text-[var(--foreground)]">12</p>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Orders</p>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-[var(--foreground)]">45</p>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Saved</p>
                                </div>
                                <div>
                                    <p className="text-xl font-black text-[var(--foreground)]">3</p>
                                    <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">Reviews</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <main className="max-w-4xl mx-auto px-4 mt-12">
                {/* Custom Tab Navigation */}
                <div className="flex justify-center border-t border-[var(--border-color)] mb-12">
                    <button 
                        onClick={() => setActiveTab('activity')}
                        className={`px-8 py-5 border-t-2 -mt-[2px] transition-all flex items-center gap-2 ${activeTab === 'activity' ? 'border-[var(--foreground)] text-[var(--foreground)] opacity-100' : 'border-transparent text-[var(--text-muted)] opacity-50 hover:opacity-80'}`}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Activity</span>
                    </button>
                    <button 
                         onClick={() => setActiveTab('favorites')}
                        className={`px-8 py-5 border-t-2 -mt-[2px] transition-all flex items-center gap-2 ${activeTab === 'favorites' ? 'border-[var(--foreground)] text-[var(--foreground)] opacity-100' : 'border-transparent text-[var(--text-muted)] opacity-50 hover:opacity-80'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Favorites</span>
                    </button>
                </div>

                {/* Tab Content */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeTab === 'activity' ? (
                        <>
                            {/* Sample Activity Cards */}
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="glass-card p-6 rounded-[2rem] border border-[var(--border-color)] group hover:scale-[1.02] transition-all cursor-pointer">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Order Update</span>
                                    </div>
                                    <p className="text-xs font-bold text-[var(--foreground)] leading-snug mb-2">Item "Vintage Tee" has been shipped by Felix Thrift.</p>
                                    <p className="text-[9px] font-medium text-[var(--text-muted)]">2 hours ago</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="col-span-full py-20 text-center opacity-50">
                            <svg className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">No saved items yet.</p>
                        </div>
                    )}
                </div>

                {/* Vendor CTA if user is not a vendor */}
                {user?.role !== 'VENDOR' && (
                    <div className="mt-20 p-8 sm:p-12 rounded-[3rem] bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative overflow-hidden shadow-2xl group cursor-pointer">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 16V5H5v14h14zM7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" /></svg>
                        </div>
                        <div className="relative z-10 max-w-lg">
                            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4 leading-none">Start selling on campus!</h3>
                            <p className="text-sm sm:text-base font-bold text-white/80 mb-8 leading-relaxed">
                                Turn your unused stuff into cash or launch your campus brand. Joins 500+ student vendors today.
                            </p>
                            <Link href="/register?role=VENDOR" className="inline-block px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                                Apply as Student Vendor
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
