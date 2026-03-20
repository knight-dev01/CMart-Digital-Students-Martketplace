'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingScreen } from './LoadingScreen';
import { useLoading } from './LoadingContext';

export const PageTransitionOverlay = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isLoading: isGlobalLoading } = useLoading();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // When path changes, show loader briefly
        setIsNavigating(true);
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 600); // Brief professional transition

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!isNavigating && !isGlobalLoading) return null;

    return <LoadingScreen message={isGlobalLoading ? "Updating Marketplace..." : "Syncing Marketplace..."} />;
};
