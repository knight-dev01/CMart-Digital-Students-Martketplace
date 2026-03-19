'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import { LoadingScreen } from './LoadingScreen';

const PUBLIC_ROUTES = ['/login', '/register', '/', '/cart', '/shops'];
const PUBLIC_PREFIXES = ['/products/', '/shops/'];

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    // Determine if the current route is public
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname) || 
                         PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix));

    useEffect(() => {
        // Only run after loading is complete
        if (isLoading) return;

        if (!user && !isPublicRoute) {
            // Unauthenticated guest trying to reach a private page
            localStorage.setItem('lastPath', pathname);
            router.push('/login');
        } else if (user && !isPublicRoute) {
            // Authenticated user on a private page (e.g. checkout, profile)
            localStorage.setItem('lastPath', pathname);
        }
    }, [user, isLoading, pathname, router, isPublicRoute]);

    // Show loading state to prevent flash of content
    if (isLoading) {
        return <LoadingScreen message="Initializing CMart Services..." />;
    }

    // Even if not loading, if no user and not public route, keep hidden until redirect kicks in
    if (!user && !isPublicRoute) {
        return <div className="fixed inset-0 bg-[var(--background)] z-[100]" />;
    }

    return (
        <div className="contents">
            {children}
        </div>
    );
};
