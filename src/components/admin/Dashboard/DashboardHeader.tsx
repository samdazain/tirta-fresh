'use client';

import { useState, useEffect } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

export default function DashboardHeader() {
    const { admin } = useAdmin();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {getGreeting()}, {admin?.name || 'Admin'}!
                    </h1>
                    <p className="text-gray-600">
                        Kelola sistem Tirta Fresh dari dashboard ini
                    </p>
                    <div className="flex items-center mt-3 space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Sistem Online
                        </div>
                        <div className="text-sm text-gray-500">
                            Login sebagai: {admin?.email || 'admin@tirtafresh.com'}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">
                        {formatDate(currentTime)}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                        {formatTime(currentTime)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        WIB
                    </div>
                </div>
            </div>
        </div>
    );
}