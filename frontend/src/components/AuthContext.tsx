'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService, User } from '@/services/auth';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
                setUser(JSON.parse(cachedUser));
            }

            const { access, refresh } = AuthService.getTokens();
            if (access) {
                try {
                    const profile = await AuthService.getProfile(access);
                    setUser(profile);
                    localStorage.setItem('user', JSON.stringify(profile));
                } catch (error) {
                    // Try to refresh if profile failed
                    if (refresh) {
                        try {
                            const { access: newAccess } = await AuthService.refreshToken(refresh);
                            AuthService.saveTokens(newAccess, refresh);
                            const profile = await AuthService.getProfile(newAccess);
                            setUser(profile);
                            localStorage.setItem('user', JSON.stringify(profile));
                        } catch (refreshErr) {
                            AuthService.logout();
                            setUser(null);
                        }
                    } else {
                        AuthService.logout();
                        setUser(null);
                    }
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (data: any) => {
        const resp = await AuthService.login(data);
        AuthService.saveTokens(resp.access, resp.refresh);
        const profile = await AuthService.getProfile(resp.access);
        setUser(profile);
        localStorage.setItem('user', JSON.stringify(profile));
    };

    const register = async (data: any) => {
        await AuthService.register(data);
        // Do not auto-login, just complete the request
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
