'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { vendorService } from '@/services/vendor';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

export default function ShopSetupPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        shop_name: '',
        description: '',
        phone: '',
        university_id: '',
        university: user?.university || ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await vendorService.applyAsVendor(formData);
            alert("Application submitted! We'll verify your student status shortly. 🎓");
            router.push('/vendor/dashboard');
        } catch (err) {
            alert("Failed to submit application. Please check your details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Visual Section */}
                    <div className="hidden lg:block space-y-12">
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black text-[var(--foreground)] uppercase tracking-tight leading-[0.9]">
                                Launch Your <span className="text-emerald-500">Student Shop</span>
                            </h1>
                            <p className="text-[var(--text-muted)] font-medium text-lg max-w-sm">Build your brand, reach thousands of students, and make money on campus.</p>
                        </div>
                        
                        <div className="space-y-8">
                            {[
                                { title: 'Safe Escrow', desc: 'Secure payments guaranteed by CMart.', icon: '🛡️' },
                                { title: 'Fast Delivery', desc: 'Campus-wide logistics at your doorstep.', icon: '🚀' },
                                { title: 'Verification', desc: 'Get a blue checkmark on your student ID.', icon: '🎓' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-6 items-start">
                                    <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-lg border border-emerald-100 dark:border-emerald-900/50">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight">{item.title}</h3>
                                        <p className="text-xs font-medium text-[var(--text-muted)]">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="glass-card bg-[var(--card-bg)] p-8 sm:p-12 rounded-[3.5rem] border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 bg-emerald-500/5 rounded-full -mr-8 -mt-8"></div>
                        
                        <div className="mb-10 lg:hidden text-center">
                            <h1 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight">Launch Shop</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Shop Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.shop_name}
                                    onChange={(e) => setFormData({...formData, shop_name: e.target.value})}
                                    placeholder="e.g. Trinity Thrift" 
                                    className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all placeholder:opacity-30" 
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        placeholder="081XXXXXXX" 
                                        className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Student ID No.</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.university_id}
                                        onChange={(e) => setFormData({...formData, university_id: e.target.value})}
                                        placeholder="TNU/2024/..." 
                                        className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Shop Description</label>
                                <textarea 
                                    rows={3} 
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="What do you sell? Vintage clothes, study aids, snacks?" 
                                    className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 resize-none transition-all placeholder:opacity-30"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-500/30 active:scale-95 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Submitting...' : 'Register as Student Vendor'}
                                </button>
                                <p className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-6 text-center leading-relaxed">
                                    By registering, you agree to CMart's <span className="text-emerald-500 cursor-pointer">Vendor Terms</span> and commission fees.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
