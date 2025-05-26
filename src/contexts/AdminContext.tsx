'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
    name: string;
    role: string;
}

interface AdminContextType {
    user: AdminUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await fetch('/api/admin/auth/session', {
                method: 'GET',
                credentials: 'include',
                cache: 'no-store',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        const response = await fetch('/api/admin/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Login failed');
        }

        if (data.authenticated) {
            await checkAuth(); // Refresh user data
        } else {
            throw new Error('Authentication failed');
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/admin/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            window.location.href = '/admin/login';
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AdminContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
