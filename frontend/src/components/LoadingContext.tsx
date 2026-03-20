'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
    withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoadingState] = useState(false);
    const activeRequests = useRef(0);

    const setIsLoading = useCallback((loading: boolean) => {
        if (loading) {
            activeRequests.current += 1;
            setIsLoadingState(true);
        } else {
            activeRequests.current = Math.max(0, activeRequests.current - 1);
            if (activeRequests.current === 0) {
                setTimeout(() => {
                    if (activeRequests.current === 0) {
                        setIsLoadingState(false);
                    }
                }, 100);
            }
        }
    }, []);

    useEffect(() => {
        const handleLoadingEvent = (e: any) => {
            if (typeof e.detail === 'boolean') {
                setIsLoading(e.detail);
            }
        };
        window.addEventListener('cmart-loading', handleLoadingEvent);
        return () => window.removeEventListener('cmart-loading', handleLoadingEvent);
    }, [setIsLoading]);

    const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
        setIsLoading(true);
        try {
            return await fn();
        } finally {
            setIsLoading(false);
        }
    }, [setIsLoading]);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading, withLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
