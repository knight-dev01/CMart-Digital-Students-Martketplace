'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';

interface Notification {
    id: number;
    message: string;
    notification_type: 'ENGAGEMENT' | 'ORDER' | 'SYSTEM';
    is_read: boolean;
    link: string;
    created_at: string;
}

interface CampusActivity {
    id: number;
    message: string;
    activity_type: string;
    timestamp: string;
}

interface NotificationContextType {
    notifications: Notification[];
    activities: CampusActivity[];
    unreadCount: number;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [activities, setActivities] = useState<CampusActivity[]>([]);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const response = await api.get('/notifications/');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, [user]);

    const fetchActivities = useCallback(async () => {
        try {
            const response = await api.get('/notifications/activity/');
            setActivities(response.data);
        } catch (error) {
            console.error('Error fetching activities:', error);
        }
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await api.post(`/notifications/${id}/read/`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        // In a real app, there might be a bulk endpoint
        // For now, we'll just update locally and notify the user it's a demo limitation if needed
        const unread = notifications.filter(n => !n.is_read);
        for (const n of unread) {
            await markAsRead(n.id);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchActivities();

            // Simple polling every 30 seconds
            const interval = setInterval(() => {
                fetchNotifications();
                fetchActivities();
            }, 30000);

            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [user, fetchNotifications, fetchActivities]);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <NotificationContext.Provider value={{ 
            notifications, 
            activities, 
            unreadCount, 
            fetchNotifications, 
            markAsRead, 
            markAllAsRead 
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
