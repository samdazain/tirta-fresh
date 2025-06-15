'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowRightIcon, EyeIcon } from '@heroicons/react/24/outline';

interface Order {
    id: string;
    customerName: string;
    items: string;
    total: number;
    status: 'selesai' | 'ditangguhkan' | 'dalam_pengiriman';
    createdAt: string;
}

export default function RecentOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/admin/dashboard');

                if (!response.ok) {
                    throw new Error('Failed to fetch recent orders');
                }

                const data = await response.json();
                setOrders(data.recentOrders || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err instanceof Error ? err.message : 'Failed to load recent orders');
            } finally {
                setLoading(false);
            }
        };

        fetchRecentOrders();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return format(parseISO(dateString), 'dd MMM, HH:mm', { locale: id });
    };

    const getStatusBadge = (status: Order['status']) => {
        const statusConfig = {
            dalam_pengiriman: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Dalam Pengiriman' },
            selesai: { color: 'bg-green-100 text-green-800 border-green-200', text: 'Selesai' },
            ditangguhkan: { color: 'bg-red-100 text-red-800 border-red-200', text: 'Dibatalkan' }
        };

        const config = statusConfig[status] || statusConfig.dalam_pengiriman;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const handleViewOrder = (orderId: string) => {
        router.push(`/admin/orders?search=${orderId}`);
    };

    const handleViewAllOrders = () => {
        router.push('/admin/orders');
    };

    if (error) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                    <p className="text-red-600 font-medium">Error loading recent orders</p>
                    <p className="text-sm text-gray-500 mt-1">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <span className="w-1 h-6 bg-green-500 rounded-full mr-3"></span>
                            Pesanan Terbaru
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            5 pesanan terakhir yang masuk
                        </p>
                    </div>
                    <button
                        onClick={handleViewAllOrders}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer"
                    >
                        Lihat Semua
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </button>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="p-6 space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg animate-pulse">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-48 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                                <div className="h-4 bg-gray-200 rounded w-12"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <EyeIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">Belum ada pesanan terbaru</p>
                    <p className="text-sm text-gray-400 mt-1">Pesanan baru akan muncul di sini</p>
                </div>
            ) : (
                <div className="p-6 space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-sm transition-all duration-200 cursor-pointer"
                            onClick={() => handleViewOrder(order.id)}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-semibold text-gray-900">
                                        #{order.id} - {order.customerName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <p className="text-sm text-gray-600 mb-2 truncate" title={order.items}>
                                    {order.items}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-900">
                                        {formatCurrency(order.total)}
                                    </span>
                                    {getStatusBadge(order.status)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}