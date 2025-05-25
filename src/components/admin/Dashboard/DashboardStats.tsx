'use client';

import { useEffect, useState } from 'react';
import {
    ShoppingBagIcon,
    TruckIcon,
    CurrencyDollarIcon,
    UsersIcon
} from '@heroicons/react/24/outline';

interface StatsData {
    totalProducts: number;
    totalOrders: number;
    pendingDeliveries: number;
    revenue: number;
    customers: number;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600 border-blue-200',
        green: 'bg-green-50 text-green-600 border-green-200',
        yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
        purple: 'bg-purple-50 text-purple-600 border-purple-200',
    };

    const iconColorClasses = {
        blue: 'text-blue-500',
        green: 'text-green-500',
        yellow: 'text-yellow-500',
        purple: 'text-purple-500',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <div className="flex items-center mt-2">
                            <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                                }`}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                            <span className="text-xs text-gray-500 ml-1">vs bulan lalu</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className={`h-8 w-8 ${iconColorClasses[color]}`} />
                </div>
            </div>
        </div>
    );
}

export default function DashboardStats() {
    const [stats, setStats] = useState<StatsData>({
        totalProducts: 0,
        totalOrders: 0,
        pendingDeliveries: 0,
        revenue: 0,
        customers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Simulate API call - replace with actual API endpoint
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock data - replace with actual API call
                setStats({
                    totalProducts: 45,
                    totalOrders: 128,
                    pendingDeliveries: 12,
                    revenue: 15750000,
                    customers: 89
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
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
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-14 w-14 bg-gray-200 rounded-xl"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
                title="Total Produk"
                value={stats.totalProducts.toString()}
                icon={ShoppingBagIcon}
                trend={{ value: 12, isPositive: true }}
                color="blue"
            />
            <StatCard
                title="Total Pesanan"
                value={stats.totalOrders.toString()}
                icon={UsersIcon}
                trend={{ value: 8, isPositive: true }}
                color="green"
            />
            <StatCard
                title="Pending Pengiriman"
                value={stats.pendingDeliveries.toString()}
                icon={TruckIcon}
                trend={{ value: -5, isPositive: false }}
                color="yellow"
            />
            <StatCard
                title="Pendapatan"
                value={formatCurrency(stats.revenue)}
                icon={CurrencyDollarIcon}
                trend={{ value: 15, isPositive: true }}
                color="purple"
            />
        </div>
    );
}