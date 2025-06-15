'use client';

import React from 'react';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

interface SummaryData {
    totalRevenue: number;
    totalItems: number;
    totalOrders: number;
    averageOrderValue: number;
}

interface ReportSummaryCardsProps {
    data: SummaryData;
}

export default function ReportSummaryCards({ data }: ReportSummaryCardsProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const cards = [
        {
            title: 'Total Penjualan',
            value: formatCurrency(data.totalRevenue),
            icon: DollarSign,
            color: 'green',
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600'
        },
        {
            title: 'Total Pesanan',
            value: data.totalOrders.toLocaleString(),
            icon: ShoppingCart,
            color: 'blue',
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Item Terjual',
            value: data.totalItems.toLocaleString(),
            icon: Package,
            color: 'purple',
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600'
        },
        {
            title: 'Rata-rata per Pesanan',
            value: formatCurrency(data.averageOrderValue),
            icon: TrendingUp,
            color: 'orange',
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${card.bgColor}`}>
                            <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
