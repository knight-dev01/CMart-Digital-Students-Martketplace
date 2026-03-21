'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/product';
import { useAuth } from '@/components/AuthContext';
import Link from 'next/link';

export default function CreateProductPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [categories, setCategories] = useState<{id: number, name: string}[]>([]);

    React.useEffect(() => {
        const fetchCategories = async () => {
            const cats = await productService.getCategories();
            if (cats && cats.length > 0) {
                setCategories(cats);
                setFormData(prev => ({ ...prev, category: String(cats[0].id) }));
            }
        };
        fetchCategories();
    }, []);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        condition: 'New',
        campus_drop: true
    });

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await productService.createProduct({
                ...formData,
                price: Number(formData.price),
                vendor_id: user?.id
            }, images);
            setStep(4);
            setTimeout(() => {
                router.push('/vendor/dashboard');
            }, 2000);
        } catch (error) {
            alert("Failed to list product. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] py-12 pb-32 font-sans">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/vendor/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-6 hover:translate-x-[-4px] transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Dashboard
                    </Link>
                    <h1 className="text-4xl font-black text-[var(--foreground)] uppercase tracking-tight leading-none">List Your Drop</h1>
                    <p className="text-[var(--text-muted)] mt-2 font-bold uppercase tracking-[0.2em] text-[10px]">Step {step} of 3 — {step === 1 ? 'Core Info' : step === 2 ? 'Details' : 'Confirm'}</p>
                </div>

                {/* Progress Bar */}
                <div className="h-1 w-full bg-[var(--border-color)]/20 rounded-full mb-12 overflow-hidden">
                    <div 
                        className="h-full bg-emerald-600 transition-all duration-500"
                        style={{ width: `${(Math.min(step, 3) / 3) * 100}%` }}
                    ></div>
                </div>

                {/* Form Card */}
                <div className="glass-card p-8 sm:p-12 rounded-[3.5rem] border border-[var(--border-color)] shadow-2xl relative overflow-hidden">
                    {/* Step 1: Core Info */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">What are you selling?</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="e.g. Vintage Nike Windbreaker" 
                                    className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all placeholder:opacity-30" 
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Price (₦)</label>
                                    <input 
                                        type="number" 
                                        value={formData.price}
                                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        placeholder="5500" 
                                        className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all" 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Category</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.category}
                                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                                            className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 appearance-none cursor-pointer"
                                        >
                                            {categories.length === 0 ? <option value="">Loading categories...</option> : 
                                                categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))
                                            }
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-500">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={nextStep}
                                disabled={!formData.name || !formData.price}
                                className="w-full py-5 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-30"
                            >
                                Continue to Details
                            </button>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Condition</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {['New', 'Used'].map(c => (
                                        <button 
                                            key={c}
                                            onClick={() => setFormData({...formData, condition: c})}
                                            className={`p-4 rounded-xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${formData.condition === c ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-emerald-200'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Description</label>
                                <textarea 
                                    rows={4} 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Describe the condition, size, or special features..." 
                                    className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 resize-none transition-all placeholder:opacity-30"
                                ></textarea>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] ml-1">Images</label>
                                <input 
                                    type="file" 
                                    multiple 
                                    accept="image/*"
                                    onChange={(e) => setImages(Array.from(e.target.files || []))}
                                    className="w-full bg-[var(--background)] border-2 border-[var(--border-color)] rounded-2xl p-5 text-sm font-bold outline-none focus:border-emerald-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-400"
                                />
                                {images.length > 0 && (
                                    <div className="text-xs text-emerald-600 mt-2 font-bold px-2">{images.length} file(s) selected</div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-5 bg-[var(--border-color)]/20 text-[var(--foreground)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[var(--border-color)]/40 transition-all">
                                    Back
                                </button>
                                <button onClick={nextStep} className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20">
                                    Final Review
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirm */}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 text-center">
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-900/50">
                                <svg className="w-10 h-10 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-black text-[var(--text-muted)] uppercase tracking-widest mb-2">Ready to Drop?</h3>
                                <p className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight">₦{Number(formData.price).toLocaleString()}</p>
                            </div>

                            <div className="p-6 bg-[var(--background)] rounded-3xl border border-[var(--border-color)] text-left">
                                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Product Recap</p>
                                <p className="text-base font-black text-[var(--foreground)] uppercase mb-2">{formData.name}</p>
                                <p className="text-xs font-medium text-[var(--text-muted)] line-clamp-2">{formData.description || 'No description provided.'}</p>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={prevStep} className="flex-1 py-5 bg-[var(--border-color)]/20 text-[var(--foreground)] rounded-2xl font-black text-xs uppercase tracking-widest">
                                    Edit Info
                                </button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={isSubmitting}
                                    className="flex-[2] py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/30"
                                >
                                    {isSubmitting ? 'Launching...' : 'Release for Sale'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in zoom-in-50 duration-500 text-center py-10">
                            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0 shadow-lg shadow-emerald-500/40">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight">Drop is Live! 🔥</h2>
                            <p className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">Redirecting to Dashboard...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
