'use client';

import React from 'react';

export const LoadingScreen = ({ message = "Initializing CMart Services..." }: { message?: string }) => {
    return (
        <div className="fixed inset-0 bg-[var(--background)] z-[100] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[var(--foreground)] rounded-2xl flex items-center justify-center animate-bounce shadow-2xl mb-6">
                <span className="text-[var(--background)] font-black text-3xl">C</span>
            </div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">{message}</p>
        </div>
    );
};
