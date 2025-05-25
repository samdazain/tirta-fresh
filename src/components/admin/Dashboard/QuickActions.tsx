'use client';

import {
    PlusIcon,
    ClipboardDocumentListIcon,
    TruckIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';

interface QuickActionProps {
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    onClick: () => void;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

function QuickActionCard({ title, description, icon: Icon, onClick, color }: QuickActionProps) {
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
            className={`
                bg-white rounded-xl shadow-sm border border-gray-200 
                p-4 hover:shadow-lg ${hoverShadowClasses[color]}
                transition-all duration-300 text-left w-full group
                transform hover:-translate-y-1 hover:border-gray-300
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                active:transform active:translate-y-0
            `}
        >
            <div className="flex flex-col items-center text-center space-y-3">
                {/* Icon Container */}
                <div className={`
                    p-4 rounded-2xl ${colorClasses[color]} 
                    transition-all duration-300 shadow-lg
                    group-hover:scale-110 group-hover:shadow-xl
                `}>
                    <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content Container */}
                <div className="flex flex-col items-center space-y-1 w-full">
                    <h3 className="
                        text-sm font-bold text-gray-900 
                        group-hover:text-gray-800 transition-colors duration-200
                        line-clamp-1 w-full
                    ">
                        {title}
                    </h3>
                    <p className="
                        text-xs text-gray-600 group-hover:text-gray-700 
                        transition-colors duration-200 leading-relaxed
                        line-clamp-2 w-full px-1
                    ">
                        {description}
                    </p>
                </div>
            </div>
        </button>
    );
}

export default function QuickActions() {
    const handleAddProduct = () => {
        // Navigate to add product page
        console.log('Navigate to add product');
    };

    const handleViewOrders = () => {
        // Navigate to orders page
        console.log('Navigate to orders');
    };

    const handleManageDelivery = () => {
        // Navigate to delivery management
        console.log('Navigate to delivery management');
    };

    const handleViewReports = () => {
        // Navigate to reports
        console.log('Navigate to reports');
    };

    return (
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
                    />
                    <QuickActionCard
                        title="Kelola Pesanan"
                        description="Lihat dan kelola pesanan masuk"
                        icon={ClipboardDocumentListIcon}
                        onClick={handleViewOrders}
                        color="green"
                    />
                    <QuickActionCard
                        title="Pengiriman"
                        description="Kelola status pengiriman"
                        icon={TruckIcon}
                        onClick={handleManageDelivery}
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
    );
}