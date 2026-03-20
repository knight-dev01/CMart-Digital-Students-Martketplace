'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useNotifications } from './NotificationContext';

export const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER': return '📦';
            case 'ENGAGEMENT': return '💬';
            case 'SYSTEM': return '🔔';
            default: return '🔔';
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'ORDER': return 'bg-blue-100 text-blue-600';
            case 'ENGAGEMENT': return 'bg-emerald-100 text-emerald-600';
            case 'SYSTEM': return 'bg-orange-100 text-orange-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[var(--text-muted)] hover:text-emerald-500 transition-all relative group"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-[var(--background)] group-hover:scale-110 transition-transform">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[2.5rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-8 py-6 border-b border-[var(--border-color)] flex items-center justify-between">
                            <h3 className="text-sm font-black text-[var(--foreground)] uppercase tracking-tight">Activity</h3>
                            <button onClick={markAllAsRead} className="text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:underline">Mark all read</button>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                            {notifications.length === 0 ? (
                                <div className="p-12 text-center opacity-40">
                                    <p className="text-[10px] font-black uppercase tracking-widest">Everything is quiet</p>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <Link 
                                        key={n.id} 
                                        href={n.link || '#'}
                                        onClick={() => {
                                            markAsRead(n.id);
                                            setIsOpen(false);
                                        }}
                                        className={`p-6 border-b border-[var(--border-color)]/50 transition-colors hover:bg-[var(--foreground)]/5 flex gap-4 ${!n.is_read ? 'bg-emerald-50/5 dark:bg-emerald-950/5' : ''}`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg ${getColors(n.notification_type)}`}>
                                            {getIcon(n.notification_type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-tight">
                                                    {n.notification_type}
                                                </p>
                                                <span className="text-[8px] font-bold text-[var(--text-muted)] uppercase tracking-widest">
                                                    {formatTime(n.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-[11px] font-medium text-[var(--text-muted)] leading-relaxed">{n.message}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        <Link 
                            href="/notifications" 
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center py-4 bg-[var(--background)]/50 text-[9px] font-black text-emerald-500 uppercase tracking-widest hover:bg-[var(--foreground)]/5 transition-colors"
                        >
                            View All Notifications
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};
