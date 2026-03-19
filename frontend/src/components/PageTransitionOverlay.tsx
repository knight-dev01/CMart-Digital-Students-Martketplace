'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingScreen } from './LoadingScreen';

export const PageTransitionOverlay = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        // When path changes, show loader briefly
        setIsNavigating(true);
        const timer = setTimeout(() => {
            setIsNavigating(false);
        }, 600); // Brief professional transition

        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    if (!isNavigating) return null;

    return <LoadingScreen message="Syncing Marketplace..." />;
};
