'use client';

import { useEffect, useState } from 'react';

interface Order {
    id: string;
    customerName: string;
    items: string;
    total: number;
    status: 'pending' | 'processing' | 'delivered' | 'cancelled';
    createdAt: string;
}

export default function RecentOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            try {
                // Simulate API call - replace with actual API endpoint
                await new Promise(resolve => setTimeout(resolve, 800));

                // Mock data - replace with actual API call
                setOrders([
                    {
                        id: 'ORD-001',
                        customerName: 'Budi Santoso',
                        items: 'Air Mineral 19L x2, Galon Kosong x1',
                        total: 45000,
                        status: 'pending',
                        createdAt: '2024-01-15T10:30:00Z'
                    },
                    {
                        id: 'ORD-002',
                        customerName: 'Sari Dewi',
                        items: 'Air Mineral 19L x1',
                        total: 22500,
                        status: 'processing',
                        createdAt: '2024-01-15T09:15:00Z'
                    },
                    {
                        id: 'ORD-003',
                        customerName: 'Ahmad Rahman',
                        items: 'Air Mineral 19L x3, Galon Kosong x2',
                        total: 75000,
                        status: 'delivered',
                        createdAt: '2024-01-14T16:45:00Z'
                    }
                ]);
            } catch (error) {
                console.error('Error fetching orders:', error);
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
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: Order['status']) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Menunggu' },
            processing: { color: 'bg-blue-100 text-blue-800', text: 'Diproses' },
            delivered: { color: 'bg-green-100 text-green-800', text: 'Terkirim' },
            cancelled: { color: 'bg-red-100 text-red-800', text: 'Dibatalkan' }
        };

        const config = statusConfig[status];
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                        Lihat Semua
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="p-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between py-3 animate-pulse">
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-48"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="p-6 text-center">
                    <p className="text-gray-500">Belum ada pesanan terbaru</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-200">
                    {orders.map((order) => (
                        <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                            <div className="flex items-center justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {order.customerName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{order.items}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(order.total)}
                                        </span>
                                        {getStatusBadge(order.status)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}