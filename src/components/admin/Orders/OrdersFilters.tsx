import React from 'react';
import { Search, Filter } from 'lucide-react';

interface OrdersFiltersProps {
    searchTerm: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusChange
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="flex-1">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <Search size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari pesanan berdasarkan nama pelanggan, ID pesanan, atau desa..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">Semua Pesanan</option>
                        <option value="DALAM_PENGIRIMAN">Dalam Pengiriman</option>
                        <option value="SELESAI">Selesai</option>
                        <option value="DITANGGUHKAN">Ditangguhkan</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default OrdersFilters;
