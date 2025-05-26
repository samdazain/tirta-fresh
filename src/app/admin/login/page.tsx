'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginContainer from '@/components/admin/Login/AdminLoginContainer';

export default function AdminLogin() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { isAuthenticated, isLoading: checkingSession, login } = useAdmin();
    const router = useRouter();

    // Redirect if already authenticated
    useEffect(() => {
        if (!checkingSession && isAuthenticated) {
            router.replace('/admin/dashboard');
        }
    }, [isAuthenticated, checkingSession, router]);

    const handleLogin = async (username: string, password: string) => {
        setError('');
        setLoading(true);

        try {
            await login(username, password);
            router.push('/admin/dashboard');
        } catch (err) {
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