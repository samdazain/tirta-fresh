'use client';

import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

interface ReportDetail {
    period: string;
    dateRange: {
        start: string;
        end: string;
    };
    totalRevenue: number;
    totalItems: number;
    totalOrders: number;
    itemBreakdown: Array<{
        name: string;
        quantity: number;
        revenue: number;
        category: string;
    }>;
}

interface ReportDetailTableProps {
    title: string;
    data: ReportDetail[];
    reportType: string;
}

export default function ReportDetailTable({ title, data, reportType }: ReportDetailTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDateRange = (dateRange: { start: string; end: string }) => {
        if (reportType === 'daily') {
            return format(parseISO(dateRange.start), 'dd MMM yyyy', { locale: id });
        }
        return `${format(parseISO(dateRange.start), 'dd MMM', { locale: id })} - ${format(parseISO(dateRange.end), 'dd MMM yyyy', { locale: id })}`;
    };

    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">Tidak ada data laporan tersedia</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Periode
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rentang Tanggal
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pesanan
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Terjual
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Penjualan
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {row.period}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {formatDateRange(row.dateRange)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {row.totalOrders.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {row.totalItems.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    {formatCurrency(row.totalRevenue)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
