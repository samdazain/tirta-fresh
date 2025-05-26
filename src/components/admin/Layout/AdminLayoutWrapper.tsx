'use client';

import { usePathname } from 'next/navigation';
import { AdminProvider } from '@/contexts/AdminContext';

interface AdminLayoutWrapperProps {
    children: React.ReactNode;
}

export default function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    return (
        <AdminProvider>
            {isLoginPage ? (
                children
            ) : (
                <div className="flex h-screen bg-gray-50">
                    <main className="flex-1 overflow-auto">
                        {children}
                    </main>
                </div>
            )}
        </AdminProvider>
    );
}