'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from './ThemeContext';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCampusOpen, setIsCampusOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [selectedCampus, setSelectedCampus] = useState('Trinity University');
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { handleAuthAction } = useRequireAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isAuthPage = ['/login', '/register'].includes(pathname);

    // Sync selected campus with logged-in user university
    React.useEffect(() => {
        if (user && user.university) {
            setSelectedCampus(user.university);
        }
    }, [user]);

    const campuses = ['Trinity University', 'UNILAG', 'OAU', 'UI', 'LASU', 'UNIBEN'];

    return (
        <nav className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-xl border-b border-[var(--border-color)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Brand - Left Aligned on Mobile with Fluid Scaling */}
                    <div className="flex shrink-0 items-center mr-2 sm:mr-4">
                        <Link href="/" className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 bg-[var(--foreground)] rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-[var(--foreground)]/5 transition-transform active:scale-95">
                                <span className="text-[var(--background)] font-black text-lg sm:text-xl">C</span>
                            </div>
                            <span className="text-base sm:text-xl font-black tracking-tighter text-[var(--foreground)] truncate max-w-[80px] sx:max-w-[120px] sm:max-w-none">
                                CMart<span className="text-emerald-500">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Campus Selector - High Visibility for Mobile & Scale */}
                    <div className="flex items-center px-2 sm:px-4 border-l border-[var(--border-color)] h-6 sm:h-8 ml-1 sm:ml-2">
                        <div className="relative">
                            <button
                                onClick={() => setIsCampusOpen(!isCampusOpen)}
                                className="flex items-center gap-1.5 sm:gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-600 transition-colors"
                            >
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span className="max-w-[60px] sx:max-w-[100px] sm:max-w-none truncate">{selectedCampus}</span>
                                <svg className={`w-2 h-2 sm:w-2.5 sm:h-2.5 opacity-50 transition-transform ${isCampusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                            </button>

                            {/* Dropdown with state-controlled visibility */}
                            {isCampusOpen && (
                                <>
                                    {/* Backdrop to close on click outside */}
                                    <div className="fixed inset-0 z-50" onClick={() => setIsCampusOpen(false)}></div>
                                    <div className="absolute top-full left-[-20px] sm:left-0 mt-3 sm:mt-2 w-48 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-[60] py-2 animate-in fade-in zoom-in duration-200">
                                        {campuses.map(campus => (
                                            <button
                                                key={campus}
                                                onClick={() => {
                                                    setSelectedCampus(campus);
                                                    setIsCampusOpen(false);
                                                }}
                                                className={`w-full text-left px-4 py-3 sm:py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors ${selectedCampus === campus ? 'text-emerald-600' : 'text-[var(--text-muted)]'}`}
                                            >
                                                {campus} Marketplace
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>




                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest">
                        {(!user && isAuthPage) ? (
                             <span className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.3em]">Welcome to CMart Marketplace</span>
                        ) : (
                            <>
                                <Link href="/" className="text-[var(--foreground)] hover:text-emerald-400 transition-colors">Marketplace</Link>
                                <Link href="/shops" className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">Student Shops</Link>
                                <Link href="/shops" className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors">Campus Vendors</Link>
                            </>
                        )}
                    </div>

                    {/* Action Icons - Fluidly spaced */}
                    <div className="flex items-center gap-0.5 sm:gap-3 md:gap-4 ml-auto shrink-0">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-all hover:scale-110 active:scale-95"
                            title={`Toggle ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                        >
                            {theme === 'dark' ? (
                                <svg className="w-5 h-5 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 0A9 9 0 115.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                            ) : (
                                <svg className="w-5 h-5 transition-all duration-300" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                            )}
                        </button>

                        {user && (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Link 
                                    href="/messages"
                                    className="p-2 text-[var(--text-muted)] hover:text-emerald-500 transition-all relative group"
                                    title="Your Inbox"
                                >
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </Link>
                                <NotificationDropdown />
                            </div>
                        )}

                        {(!user || user.role === 'BUYER') && (
                            <div onClick={() => router.push('/cart')} className="cursor-pointer p-2 bg-[var(--border-color)] text-emerald-400 rounded-xl hover:bg-[var(--border-color)]/80 transition-colors relative">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--background)] animate-bounce">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        )}
                        

                        {!user ? (
                            <div className="flex items-center gap-1 sm:space-x-2 shrink-0">
                                <Link href="/login" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] hover:text-emerald-400 px-1 sm:px-2 transition-colors">Login</Link>
                                <Link href="/register" className="hidden sm:block py-2 px-4 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">Signup</Link>
                            </div>
                        ) : (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center space-x-3 group cursor-pointer focus:outline-none"
                                >
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">@{user.username}</p>
                                        <p className="text-[8px] font-black uppercase tracking-[0.2em] text-emerald-400 opacity-60">
                                            {user.role === 'VENDOR' ? 'Vendor' : 'Buyer'}
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/40 rounded-full border-2 border-emerald-500/20 shadow-sm overflow-hidden flex items-center justify-center group-hover:border-emerald-500 transition-all active:scale-95">
                                        <span className="text-emerald-500 font-black text-xs uppercase">{user.username[0]}</span>
                                    </div>
                                </button>

                                {isProfileOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                        <div className="absolute right-0 mt-3 w-56 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-3xl shadow-2xl z-20 py-3 px-2 animate-in fade-in zoom-in-95 duration-200">
                                            <Link 
                                                href={user.role === 'VENDOR' ? '/vendor/dashboard' : '/profile'}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[var(--foreground)] hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600">👤</div>
                                                {user.role === 'VENDOR' ? 'Vendor Dashboard' : 'My Profile'}
                                            </Link>
                                            <button 
                                                onClick={() => {
                                                    logout();
                                                    setIsProfileOpen(false);
                                                    window.location.href = '/';
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                                            >
                                                <div className="w-6 h-6 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600">🚪</div>
                                                Logout
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-1.5 sm:p-2 text-[var(--text-muted)] hover:text-[var(--foreground)] shrink-0 ml-1 -mr-1.5 sm:mr-0"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {isMenuOpen && (
                <div className="md:hidden bg-[var(--background)] border-b border-[var(--border-color)] py-4 px-6 space-y-4 animate-in slide-in-from-top duration-300">
                    {(!user && isAuthPage) ? (
                        <div className="py-2">
                             <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Signed in to explore</p>
                        </div>
                    ) : (
                        <>
                            <Link href="/" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-[var(--foreground)]">Marketplace</Link>
                            <Link href="/shops" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)]">Student Shops</Link>
                            <Link href="/shops" onClick={() => setIsMenuOpen(false)} className="block text-sm font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--foreground)]">Campus Vendors</Link>
                        </>
                    )}
                    <Link
                        href={user ? (user.role === 'VENDOR' ? '/vendor/dashboard' : '/profile') : '/login'}
                        onClick={() => setIsMenuOpen(false)}
                        className="pt-4 border-t border-[var(--border-color)] flex items-center space-x-3 group"
                    >
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black text-xs">
                            {user ? user.username[0].toUpperCase() : '?'}
                        </div>
                        <div>
                            <span className="block text-xs font-black text-[var(--foreground)] uppercase tracking-widest">
                                {user ? (user.role === 'VENDOR' ? 'Shop Dashboard' : 'Account Profile') : 'Login / Register'}
                            </span>
                            <span className="block text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">CMart Campus Member</span>
                        </div>
                    </Link>

                    {user && (
                        <button 
                            onClick={() => {
                                logout();
                                setIsMenuOpen(false);
                                window.location.href = '/';
                            }}
                            className="w-full flex items-center space-x-3 px-4 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest mt-2"
                        >
                            <span>Logout Account</span>
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};
