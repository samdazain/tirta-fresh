import React from 'react';
import {
    CheckCircle,
    Truck,
    AlertCircle
} from 'lucide-react';


interface OrderStatusBadgeProps {
    status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    let label = '';

    switch (status) {
        case 'DALAM_PENGIRIMAN':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            icon = <Truck size={14} className="mr-1" />;
            label = 'Dalam Pengiriman';
            break;
        case 'SELESAI':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            icon = <CheckCircle size={14} className="mr-1" />;
            label = 'Selesai';
            break;
        case 'DITANGGUHKAN':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            icon = <AlertCircle size={14} className="mr-1" />;
            label = 'Ditangguhkan';
            break;
        default:
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            label = status;
    }

    return (
        <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full transition-all duration-200 hover:shadow-md cursor-default ${bgColor} ${textColor}`}>
            {icon}
            {label}
        </span>
    );
};

export default OrderStatusBadge;
