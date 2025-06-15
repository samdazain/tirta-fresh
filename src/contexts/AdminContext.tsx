'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface Admin {
    id: number;
    name: string;
    email: string;
}

interface AdminContextType {
    admin: Admin | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};

interface AdminProviderProps {
    children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkSession = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/admin/auth/session', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                if (data.authenticated) {
                    setAdmin(data.admin);
                    setIsAuthenticated(true);
                } else {
                    setAdmin(null);
                    setIsAuthenticated(false);
                }
            } else {
                setAdmin(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error('Session check failed:', error);
            setAdmin(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login gagal');
            }

            const data = await response.json();
            setAdmin(data.admin);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/admin/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setAdmin(null);
            setIsAuthenticated(false);
            // Redirect to login page after logout
            router.push('/admin/login');
        }
    };

    useEffect(() => {
        checkSession();
    }, []);

    return (
        <AdminContext.Provider value={{
            admin,
            isAuthenticated,
            isLoading,
            login,
            logout,
            checkSession
        }}>
            {children}
        </AdminContext.Provider>
    );
};