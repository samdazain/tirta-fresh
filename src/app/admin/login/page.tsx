'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginContainer from '@/components/admin/Login/AdminLoginContainer';

export default function AdminLogin() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const router = useRouter();

    // Check if user is already logged in
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/admin/auth/session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated) {
                        router.replace('/admin/dashboard');
                        return;
                    }
                }
            } catch (err) {
                console.error('Error checking session:', err);
            } finally {
                setCheckingSession(false);
            }
        };

        checkSession();
    }, [router]);

    const handleLogin = async (username: string, password: string) => {
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login...');

            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include', // Ensure cookies are included
            });

            const data = await response.json();
            console.log('Login response:', response.status, data);

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Check if login was successful
            if (data.authenticated === true) {
                console.log('Login successful, redirecting...');

                // Use router.push with refresh
                router.push('/admin/dashboard');
                router.refresh();
            } else {
                throw new Error('Authentication failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLoginContainer
            onSubmit={handleLogin}
            loading={loading}
            error={error}
            checkingSession={checkingSession}
        />
    );
}