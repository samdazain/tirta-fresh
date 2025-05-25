'use client';

import { useState } from 'react';

interface DashboardHeaderProps {
    userName?: string;
}

export default function DashboardHeader({ userName = 'Admin' }: DashboardHeaderProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update time every minute
    useState(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    });

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

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Selamat datang, {userName}!
                    </h1>
                    <p className="text-gray-600">
                        Kelola sistem Tirta Fresh dari dashboard ini
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-gray-500">
                        {formatDate(currentTime)}
                    </div>
                    <div className="text-2xl font-semibold text-blue-600">
                        {formatTime(currentTime)}
                    </div>
                </div>
            </div>
        </div>
    );
}