'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryMessage = searchParams.get('message');
    const redirectPath = searchParams.get('redirect');

    // If already logged in, redirect away from the login page
    React.useEffect(() => {
        if (!isLoading && user) {
            const lastPath = localStorage.getItem('lastPath');
            if (redirectPath) {
                router.push(redirectPath);
            } else if (lastPath && lastPath !== '/' && lastPath !== '/login' && lastPath !== '/register') {
                router.push(lastPath);
                localStorage.removeItem('lastPath');
            } else if (user.role === 'VENDOR') {
                router.push('/vendor/dashboard');
            } else {
                router.push('/');
            }
        }
    }, [user, isLoading, router, redirectPath]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await login({
                email: credentials.email,
                password: credentials.password
            });
            
            // Redirect based on role
            // We need to get the user object from AuthContext or response
            // The login function in AuthContext already sets the user state.
            // Let's assume the user object is available or we can check the role from the stored user
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            setSuccess('Welcome back! Syncing profile...');
            
            setTimeout(() => {
                const lastPath = localStorage.getItem('lastPath');
                if (redirectPath) {
                    router.push(redirectPath);
                } else if (lastPath && lastPath !== '/' && lastPath !== '/login' && lastPath !== '/register') {
                    router.push(lastPath);
                    localStorage.removeItem('lastPath');
                } else if (storedUser.role === 'VENDOR') {
                    router.push('/vendor/dashboard');
                } else {
                    router.push('/');
                }
            }, 1000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 pb-24">
            <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-[var(--card-bg)] p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-[var(--border-color)] shadow-xl relative z-10">
                <div className="text-center">
                    <div className="w-12 h-12 bg-[var(--foreground)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-[var(--background)] font-black text-2xl">C</span>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest">Login to CMart</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold p-4 rounded-2xl text-center">
                            {error}
                        </div>
                    )}

                    {(success || queryMessage) && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold p-4 rounded-2xl text-center animate-pulse">
                            {success || queryMessage}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-4">Email Address</label>
                            <input
                                type="email"
                                required
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                className="w-full px-6 py-4 bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-[var(--text-muted)]/50"
                                placeholder="Enter your email address"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-4">Password</label>
                            <input
                                type="password"
                                required
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                className="w-full px-6 py-4 bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-[var(--text-muted)]/50"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                            <label className="ml-2 block text-xs font-bold text-[var(--text-muted)]">Remember me</label>
                        </div>
                        <div className="text-xs font-bold">
                            <a href="#" className="text-emerald-400 hover:text-emerald-300">Forgot password?</a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-center space-y-4">
                    <p className="text-xs font-bold text-[var(--text-muted)]">
                        Don't have an account?{' '}
                        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 ml-1">Create account</Link>
                    </p>
                    <div className="pt-2">
                        <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-emerald-500 transition-colors">
                            Proceed as a Guest
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
