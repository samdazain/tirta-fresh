'use client';

import React from 'react';

interface ProductSale {
    name: string;
    quantity: number;
    revenue: number;
    category: string;
}

interface ProductSalesTableProps {
    data: ProductSale[];
    maxRows?: number;
}

export default function ProductSalesTable({ data, maxRows = 15 }: ProductSalesTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getCategoryBadge = (category: string) => {
        const colors = {
            'GALON': 'bg-blue-100 text-blue-800',
            'BOTOL': 'bg-green-100 text-green-800',
            'GELAS': 'bg-purple-100 text-purple-800',
            'LAINNYA': 'bg-gray-100 text-gray-800'
        };

        return colors[category as keyof typeof colors] || colors.LAINNYA;
    };

    const displayData = maxRows ? data.slice(0, maxRows) : data;

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Tidak ada data penjualan produk tersedia</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Produk Terlaris</h3>
                {maxRows && data.length > maxRows && (
                    <p className="text-sm text-gray-500 mt-1">
                        Menampilkan {maxRows} teratas dari {data.length} produk
                    </p>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ranking
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nama Produk
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Terjual
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pendapatan
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kontribusi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayData.map((product, index) => {
                            const totalRevenue = data.reduce((sum, p) => sum + p.revenue, 0);
                            const contribution = ((product.revenue / totalRevenue) * 100).toFixed(1);

                            return (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                                            <span className="text-xs font-medium">#{index + 1}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        <div className="max-w-xs">
                                            <p className="truncate">{product.name}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryBadge(product.category)}`}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                                        {product.quantity.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                        {formatCurrency(product.revenue)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">
                                        {contribution}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
