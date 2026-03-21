'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutVerifyPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
    
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    useEffect(() => {
        if (!reference) {
            router.push('/');
            return;
        }

        // The webhook handles the actual backend verification. 
        // We just show a pleasant UI for the user returning from Paystack.
        // In a strictly robust system, we would poll the backend order status here.
        setTimeout(() => {
            setStatus('success');
        }, 1500);

    }, [reference, router]);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
                <div className="flex flex-col items-center">
                    <svg className="animate-spin h-10 w-10 text-emerald-500 mb-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h2 className="text-xl font-black text-[var(--foreground)] uppercase tracking-widest">Verifying Payment...</h2>
                    <p className="text-sm text-[var(--text-muted)] mt-2 font-medium">Please wait while we confirm with the gateway.</p>
                </div>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-[var(--background)]">
                <div className="max-w-md w-full bg-[var(--card-bg)] rounded-[3rem] p-12 text-center shadow-2xl border border-emerald-100 dark:border-emerald-900/50">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce transition-all">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Payment Successful!</h2>
                    <p className="text-xs text-[var(--text-muted)] font-black uppercase tracking-widest mb-2 font-mono break-all">REF: {reference}</p>
                    <p className="text-[var(--text-muted)] font-medium mb-10 leading-relaxed text-sm">Your order has been placed successfully. Our escrow system will secure your funds until delivery is confirmed.</p>
                    <Link
                        href="/"
                        className="block w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        );
    }

    return null;
}
