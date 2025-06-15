'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
    PlusIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface QuickActionProps {
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
    color: 'blue' | 'green' | 'purple' | 'orange';
    disabled?: boolean;
    badge?: number;
}

// interface LowStockProduct {
//     id: number;
//     name: string;
//     stock: number;
//     category: string;
// }

function QuickActionCard({
    title,
    description,
    icon: Icon,
    onClick,
    color,
    disabled = false,
    badge
}: QuickActionProps) {
    const colorClasses = {
        blue: 'bg-blue-500 hover:bg-blue-600 group-hover:shadow-blue-200',
        green: 'bg-green-500 hover:bg-green-600 group-hover:shadow-green-200',
        purple: 'bg-purple-500 hover:bg-purple-600 group-hover:shadow-purple-200',
        orange: 'bg-orange-500 hover:bg-orange-600 group-hover:shadow-orange-200',
    };

    const hoverShadowClasses = {
        blue: 'group-hover:shadow-blue-100',
        green: 'group-hover:shadow-green-100',
        purple: 'group-hover:shadow-purple-100',
        orange: 'group-hover:shadow-orange-100',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                bg-white rounded-xl shadow-sm border border-gray-200 
                p-4 transition-all duration-300 text-left w-full group relative
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : `hover:shadow-lg ${hoverShadowClasses[color]} cursor-pointer transform hover:-translate-y-1 hover:border-gray-300 active:transform active:translate-y-0`
                }
            `}
        >
            {/* Badge */}
            {badge !== undefined && badge > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {badge > 99 ? '99+' : badge}
                </div>
            )}

            <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon Container */}
                <div className={`
                    p-4 rounded-2xl transition-all duration-300 shadow-lg
                    ${disabled
                        ? 'bg-gray-400'
                        : `${colorClasses[color]} group-hover:scale-110 group-hover:shadow-xl`
                    }
                `}>
                    <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content Container */}
                <div className="flex flex-col items-center space-y-1 w-full">
                    <h3 className={`
                        text-sm font-bold transition-colors duration-200
                        line-clamp-1 w-full
                        ${disabled
                            ? 'text-gray-500'
                            : 'text-gray-900 group-hover:text-gray-800'
                        }
                    `}>
                        {title}
                    </h3>
                    <p className={`
                        text-xs transition-colors duration-200 leading-relaxed
                        line-clamp-2 w-full px-1
                        ${disabled
                            ? 'text-gray-400'
                            : 'text-gray-600 group-hover:text-gray-700'
                        }
                    `}>
                        {description}
                    </p>
                </div>
            </div>
        </button>
    );
}

export default function QuickActions() {
    const router = useRouter();
    const [lowStockCount, setLowStockCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await fetch('/api/admin/dashboard');
                if (response.ok) {
                    const data = await response.json();
                    setLowStockCount(data.lowStockProducts?.length || 0);
                    setPendingCount(data.stats?.pendingDeliveries || 0);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        fetchDashboardData();
    }, []);

    const handleAddProduct = () => {
        try {
            router.push('/admin/products?action=add');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleViewOrders = () => {
        try {
            router.push('/admin/orders');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleManageInvoice = () => {
        try {
            router.push('/admin/invoices');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    const handleViewReports = () => {
        try {
            router.push('/admin/reports');
        } catch (error) {
            console.error('Navigation error:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                        <span className="w-1 h-6 bg-blue-500 rounded-full mr-3"></span>
                        Aksi Cepat
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Akses cepat ke fitur utama sistem
                    </p>
                </div>

                {/* Actions Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                        <QuickActionCard
                            title="Tambah Produk"
                            description="Tambahkan produk baru ke inventory"
                            icon={PlusIcon}
                            onClick={handleAddProduct}
                            color="blue"
                            badge={lowStockCount}
                        />
                        <QuickActionCard
                            title="Kelola Pesanan"
                            description="Lihat dan kelola pesanan masuk"
                            icon={ClipboardDocumentListIcon}
                            onClick={handleViewOrders}
                            color="green"
                            badge={pendingCount}
                        />
                        <QuickActionCard
                            title="Kelola Invoice"
                            description="Kelola invoice dan pembayaran"
                            icon={DocumentTextIcon}
                            onClick={handleManageInvoice}
                            color="purple"
                        />
                        <QuickActionCard
                            title="Laporan"
                            description="Lihat laporan dan analitik"
                            icon={ChartBarIcon}
                            onClick={handleViewReports}
                            color="orange"
                        />
                    </div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockCount > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-orange-200 overflow-hidden">
                    <div className="px-6 py-4 bg-orange-50 border-b border-orange-200">
                        <div className="flex items-center">
                            <ExclamationTriangleIcon className="h-5 w-5 text-orange-600 mr-2" />
                            <h3 className="text-sm font-bold text-orange-900">
                                Peringatan Stok Rendah
                            </h3>
                        </div>
                    </div>
                    <div className="p-6">
                        <p className="text-sm text-gray-600 mb-3">
                            {lowStockCount} produk memiliki stok rendah (kurang dari 10 unit)
                        </p>
                        <button
                            onClick={() => router.push('/admin/products?filter=low-stock')}
                            className="text-sm bg-orange-100 text-orange-800 px-3 py-1 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer"
                        >
                            Lihat Produk
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}