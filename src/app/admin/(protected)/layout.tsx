'use client';

import AdminSidebar from '@/components/admin/Sidebar/AdminSidebar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/admin/Login/LoadingSpinner';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        async function checkAuth() {
            try {
                const res = await fetch('/api/admin/auth/session', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    cache: 'no-store',
                });

                const data = await res.json();

                if (!data.authenticated) {
                    router.replace('/admin/login');
                } else {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                router.replace('/admin/login');
            }
        }

        checkAuth();
    }, [router, mounted]);

    // Show loading state until mounted and authenticated
    if (!mounted || loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}