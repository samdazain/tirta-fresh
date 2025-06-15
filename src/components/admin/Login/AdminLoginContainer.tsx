'use client';

import Image from 'next/image';
import logo from "@/public/assets/logo.png";
import LoginForm from './LoginForm';
import LoadingSpinner from './LoadingSpinner';

interface AdminLoginContainerProps {
    onSubmit: (username: string, password: string) => Promise<void>;
    loading: boolean;
    error: string;
    checkingSession: boolean;
}

export default function AdminLoginContainer({
    onSubmit,
    loading,
    error,
    checkingSession
}: AdminLoginContainerProps) {
    if (checkingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <LoadingSpinner size="large" />
                    <p className="mt-4 text-white/90 font-medium">Memeriksa sesi...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
            <div className="w-full max-w-md">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                            <div className="relative bg-white p-4 rounded-2xl shadow-2xl">
                                <Image
                                    src={logo}
                                    alt="Tirta Fresh Logo"
                                    width={60}
                                    height={72}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Admin Panel
                    </h1>
                    <p className="text-blue-200 text-sm">
                        Kelola sistem Tirta Fresh dengan mudah
                    </p>
                </div>

                {/* Login Form */}
                <LoginForm
                    onSubmit={onSubmit}
                    loading={loading}
                    error={error}
                />

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-blue-200/60">
                        © 2025 Tirta Fresh. Sistem Administrasi v1.0.0
                    </p>
                </div>
            </div>
        </div>
    );
}