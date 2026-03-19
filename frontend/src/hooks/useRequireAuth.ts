'use client';

import { useAuth } from '@/components/AuthContext';
import { useRouter } from 'next/navigation';

export function useRequireAuth() {
    const { user } = useAuth();
    const router = useRouter();

    const handleAuthAction = (callback: () => void) => {
        if (!user) {
            router.push('/login');
            return;
        }
        callback();
    };

    return { handleAuthAction, isAuthenticated: !!user };
}
