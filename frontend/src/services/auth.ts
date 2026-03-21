const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
    id: number;
    username: string;
    email: string;
    role: 'BUYER' | 'VENDOR' | 'ADMIN' | 'SUPERADMIN';
    university?: string;
    avatar?: string;
}

export interface AuthResponse {
    user: User;
    access: string;
    refresh: string;
}

export const AuthService = {
    async register(data: any): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }
        return response.json();
    },

    async login(data: any): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Login failed. Please check your credentials.');
        }
        const tokenData = await response.json();
        return tokenData;
    },

    async getProfile(token: string): Promise<User> {
        const response = await fetch(`${API_URL}/auth/profile/`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch profile');
        return response.json();
    },

    async refreshToken(refresh: string): Promise<{ access: string }> {
        const response = await fetch(`${API_URL}/auth/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh }),
        });
        if (!response.ok) throw new Error('Refresh failed');
        return response.json();
    },

    saveTokens(access: string, refresh: string) {
        localStorage.setItem('access_token', access);
        if (refresh) localStorage.setItem('refresh_token', refresh);
    },

    getTokens() {
        return {
            access: localStorage.getItem('access_token'),
            refresh: localStorage.getItem('refresh_token'),
        };
    },

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
    }
};
