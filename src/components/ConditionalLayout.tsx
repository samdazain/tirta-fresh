'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface ConditionalLayoutProps {
    children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Don't render until mounted to prevent hydration mismatch
    if (!mounted) {
        return <div>{children}</div>;
    }

    // Check if current path is admin route
    const isAdminRoute = pathname?.startsWith('/admin');

    // For admin routes, render without navbar and footer
    if (isAdminRoute) {
        return <div>{children}</div>;
    }

    // For regular routes, render with navbar and footer
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow">
                {children}
            </div>
            <Footer />
        </div>
    );
}