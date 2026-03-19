'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'BUYER' as 'BUYER' | 'VENDOR',
        university: 'Trinity University'
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await register(formData);
            setSuccess('Account created successfully! Please sign in.');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            let msg = 'Registration failed';
            try {
                const data = JSON.parse(err.message);
                msg = Object.values(data).flat().join(' ') || msg;
            } catch {
                msg = err.message || msg;
            }
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[95vh] flex items-center justify-center px-4 py-12 pb-24">
            <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-[var(--card-bg)] p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-[var(--border-color)] shadow-xl relative z-10">
                <div className="text-center">
                    <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                        <span className="text-white font-black text-2xl">C</span>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Join CMart</h2>
                    <p className="mt-2 text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest">Digital Campus Marketplace</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold p-4 rounded-2xl text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold p-4 rounded-2xl text-center">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'BUYER' })}
                                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.role === 'BUYER'
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-[var(--background)] border-[var(--border-color)] text-[var(--text-muted)]'
                                    }`}
                            >
                                I'm a Student
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'VENDOR' })}
                                className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.role === 'VENDOR'
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                                    : 'bg-[var(--background)] border-[var(--border-color)] text-[var(--text-muted)]'
                                    }`}
                            >
                                I'm a Vendor
                            </button>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-4">Username</label>
                            <input
                                type="text"
                                required
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-6 py-4 bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-[var(--text-muted)]/50 font-medium"
                                placeholder="Choose a username"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-4">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-6 py-4 bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-[var(--text-muted)]/50 font-medium"
                                placeholder="name@university.edu"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-4">Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-6 py-4 bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-[var(--text-muted)]/50 font-medium"
                                placeholder="Create a strong password"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-4">University / Campus</label>
                            <div className="relative">
                                <select
                                    value={formData.university}
                                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                                    className="w-full px-6 py-4 bg-[var(--background)] border border-[var(--border-color)] text-[var(--foreground)] rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer pr-10"
                                >
                                    <option value="Trinity University">Trinity University</option>
                                    <option value="UNILAG">University of Lagos (UNILAG)</option>
                                    <option value="OAU">Obafemi Awolowo University (OAU)</option>
                                    <option value="UI">University of Ibadan (UI)</option>
                                    <option value="LASU">Lagos State University (LASU)</option>
                                    <option value="UNIBEN">University of Benin (UNIBEN)</option>
                                </select>
                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all transform active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Get Started'}
                        </button>
                    </div>
                </form>

                <div className="text-center">
                    <p className="text-xs font-bold text-[var(--text-muted)]">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 ml-1">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
