import React from 'react';
import { Search, Filter, Calendar, RefreshCw } from 'lucide-react';

interface OrdersFiltersProps {
    searchTerm: string;
    statusFilter: string;
    timeframeFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onTimeframeChange: (value: string) => void;
    onRefresh: () => void;
    isRefreshing?: boolean;
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
    searchTerm,
    statusFilter,
    timeframeFilter,
    onSearchChange,
    onStatusChange,
    onTimeframeChange,
    onRefresh,
    isRefreshing = false
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

                <div className="flex items-center gap-4">
                    {/* Timeframe Filter */}
                    <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-gray-500" />
                        <select
                            value={timeframeFilter}
                            onChange={(e) => onTimeframeChange(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
                        >
                            <option value="all">Semua Waktu</option>
                            <option value="today">Hari Ini</option>
                            <option value="week">Minggu Ini</option>
                            <option value="month">Bulan Ini</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusChange(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
                        >
                            <option value="all">Semua Status</option>
                            <option value="DALAM_PENGIRIMAN">Dalam Pengiriman</option>
                            <option value="SELESAI">Selesai</option>
                            <option value="DITANGGUHKAN">Ditangguhkan</option>
                        </select>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={onRefresh}
                        disabled={isRefreshing}
                        className="p-2 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Refresh data pesanan"
                    >
                        <RefreshCw
                            size={18}
                            className={`text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrdersFilters;
