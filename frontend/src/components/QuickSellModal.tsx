'use client';

import React, { useState } from 'react';

export const QuickSellModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: '6', // Default to Other/General
        image: ''
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const categories = [
        { id: '1', name: 'Electronics' },
        { id: '2', name: 'Fashion' },
        { id: '3', name: 'Books' },
        { id: '4', name: 'Food' },
        { id: '5', name: 'Services' },
        { id: '6', name: 'Other' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/products/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    price: formData.price,
                    description: formData.description,
                    category: parseInt(formData.category),
                    images: formData.image ? [{ image: formData.image }] : []
                })
            });

            if (response.ok) {
                setStatus('success');
                setTimeout(() => {
                    onClose();
                    window.location.reload(); // Refresh to show new product
                }, 1500);
            } else {
                setStatus('error');
            }
        } catch (error) {
            console.error("Quick sell failed:", error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
            <div className="bg-[var(--card-bg)] w-full max-w-lg rounded-[2.5rem] border border-[var(--border-color)] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-2xl font-black text-[var(--foreground)] uppercase tracking-tight">Quick Sell</h3>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">List your item in seconds</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[var(--background)] flex items-center justify-center border border-[var(--border-color)]">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {status === 'success' ? (
                        <div className="py-12 text-center space-y-4">
                            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-600 animate-bounce">
                                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                            <h4 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight">Listed Successfully!</h4>
                            <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest leading-relaxed">Your item is now live in the marketplace feed.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {status === 'error' && (
                                <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 text-[10px] font-black uppercase tracking-widest text-center rounded-2xl border border-red-100 dark:border-red-900/50">
                                    Something went wrong. Please try again.
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block ml-2">Item Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="What are you selling?"
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block ml-2">Price (₦)</label>
                                    <input
                                        required
                                        type="number"
                                        placeholder="0.00"
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block ml-2">Category</label>
                                    <select
                                        className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm appearance-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block ml-2">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Condition, campus pickup details..."
                                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm resize-none"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 block ml-2">Image URL</label>
                                <input
                                    type="url"
                                    placeholder="Paste image link here"
                                    className="w-full bg-[var(--background)] border border-[var(--border-color)] rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[var(--foreground)] text-[var(--background)] rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50 mt-4"
                            >
                                {loading ? 'Listing Item...' : 'Post Listing'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
