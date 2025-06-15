'use client';

import { useEffect, useState } from 'react';
import {
    ShoppingBagIcon,
    TruckIcon,
    CurrencyDollarIcon,
    ClipboardDocumentListIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface StatsData {
    totalProducts: number;
    totalOrders: number;
    pendingDeliveries: number;
    todayOrders: number;
    revenue: number;
    revenueTrend: number;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
    subtitle?: string;
}

function StatCard({ title, value, icon: Icon, trend, color, subtitle }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
        orange: 'bg-orange-50 text-orange-600 border-orange-200',
    };

    const iconColorClasses = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        yellow: 'text-yellow-500',
        purple: 'text-purple-500',
        orange: 'text-orange-500',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 cursor-default">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
                    )}
                    {trend && (
                        <div className="flex items-center">
                            <span className={`text-xs font-medium flex items-center ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                <span className="mr-1">
                                    {trend.isPositive ? '↗' : '↘'}
                                </span>
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-xs text-gray-500 ml-1">vs bulan lalu</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]} shadow-sm`}>
                    <Icon className={`h-8 w-8 ${iconColorClasses[color]}`} />
                </div>
            </div>
        </div>
    );
}

export default function DashboardStats() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/dashboard');

                if (!response.ok) {
                    throw new Error('Failed to fetch dashboard stats');
                }

                const data = await response.json();
                setStats(data.stats);
                setError(null);
            } catch (err) {
                console.error('Error fetching stats:', err);
                setError(err instanceof Error ? err.message : 'Failed to load statistics');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-20"></div>
                            </div>
                            <div className="h-14 w-14 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-8">
                <p className="font-medium">Error loading statistics:</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
                title="Total Produk"
                value={stats.totalProducts.toString()}
                subtitle="Di inventory"
                icon={ShoppingBagIcon}
                color="blue"
            />
            <StatCard
                title="Total Pesanan"
                value={stats.totalOrders.toString()}
                subtitle="Semua waktu"
                icon={ClipboardDocumentListIcon}
                color="green"
            />
            <StatCard
                title="Pesanan Hari Ini"
                value={stats.todayOrders.toString()}
                subtitle="Pesanan baru"
                icon={CalendarDaysIcon}
                color="orange"
            />
            <StatCard
                title="Pending Pengiriman"
                value={stats.pendingDeliveries.toString()}
                subtitle="Menunggu dikirim"
                icon={TruckIcon}
                color="yellow"
            />
            <StatCard
                title="Pendapatan Bulanan"
                value={formatCurrency(stats.revenue)}
                subtitle="Bulan ini"
                icon={CurrencyDollarIcon}
                trend={{
                    value: stats.revenueTrend,
                    isPositive: stats.revenueTrend >= 0
                }}
                color="purple"
            />
        </div>
    );
}