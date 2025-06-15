'use client';

import { useState, useEffect, useCallback } from 'react';
// import { format } from 'date-fns';
import {
    DollarSign,
    Package,
    ShoppingCart,
    AlertCircle
} from 'lucide-react';

import { useToast } from '@/contexts/ToastContext';
interface SalesData {
    period: string;
    totalSales: number;
    totalItems: number;
    orders: number;
}

interface ProductSale {
    name: string;
    category: string;
    quantity: number;
    revenue: number;
}

interface ReportData {
    salesData: SalesData[];
    productSales: ProductSale[];
    totals: {
        totalRevenue: number;
        totalItems: number;
        totalOrders: number;
    };
    period: string;
}

// Simple Card Component
function SimpleCard({ title, value, icon: Icon, color = "blue" }: {
    title: string;
    value: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color?: 'blue' | 'green' | 'purple';
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

// Time Period Selector
function TimePeriodSelector({ activeTab, onTabChange }: {
    activeTab: string;
    onTabChange: (tab: string) => void;
}) {
    const tabs = [
        { key: 'daily', label: 'Daily' },
        { key: 'weekly', label: 'Weekly' },
        { key: 'monthly', label: 'Monthly' },
    ];

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex space-x-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onTabChange(tab.key)}
                        className={`px-4 py-2 rounded-md font-medium transition-colors ${activeTab === tab.key
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Sales Table Component
function SalesTable({ data, title }: { data: SalesData[]; title: string }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No sales data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Period
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Orders
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items Sold
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total Sales
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {row.period}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {row.orders.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {row.totalItems.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    Rp {row.totalSales.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Product Sales Table Component
function ProductSalesTable({ data }: { data: ProductSale[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500">No product sales data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Product Sales Details</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Product Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity Sold
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Revenue
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((product, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {product.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                                    {product.quantity.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                    Rp {product.revenue.toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('daily');
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { showError } = useToast();

    const fetchReportData = useCallback(async (reportType: string) => {
        setLoading(true);
        setError(null);

        try {
            const periods = reportType === 'daily' ? 7 : reportType === 'weekly' ? 4 : 12;
            const response = await fetch(`/api/admin/reports?type=${reportType}&periods=${periods}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || `Failed to fetch ${reportType} reports`);
            }

            const data = await response.json();

            // Transform the data with better fallbacks
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const salesData: SalesData[] = (data.reports || []).map((report: any) => ({
                period: report.dateLabel || report.weekLabel || report.monthLabel || 'Unknown',
                totalSales: report.totalRevenue || 0,
                totalItems: report.totalItems || 0,
                orders: report.totalOrders || 0
            }));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const productSales: ProductSale[] = (data.productSales || []).map((product: any) => ({
                name: product.name || 'Unknown Product',
                category: product.category || 'General',
                quantity: product.quantity || 0,
                revenue: product.revenue || 0
            }));

            setReportData({
                salesData,
                productSales,
                totals: {
                    totalRevenue: data.summary?.totalRevenue || 0,
                    totalItems: data.summary?.totalItems || 0,
                    totalOrders: data.summary?.totalOrders || 0
                },
                period: data.period || `${reportType} Report`
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            if (showError) {
                showError(`Failed to load ${reportType} reports: ${errorMessage}`);
            }
        } finally {
            setLoading(false);
        }
    }, [showError]);
    useEffect(() => {
        fetchReportData(activeTab);
    }, [activeTab, fetchReportData]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
                    <p className="text-gray-600">View sales data and product performance</p>
                </div>

                <div className="flex justify-center py-20">
                    <div className="text-center">
                        <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading sales reports...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
                <p className="text-gray-600">View sales data and product performance</p>
            </div>

            {/* Time Period Selector */}
            <TimePeriodSelector
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 flex items-center">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Content */}
            {!error && reportData && (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <SimpleCard
                            title="Total Sales"
                            value={`Rp ${reportData.totals.totalRevenue.toLocaleString()}`}
                            icon={DollarSign}
                            color="green"
                        />
                        <SimpleCard
                            title="Items Sold"
                            value={reportData.totals.totalItems.toLocaleString()}
                            icon={Package}
                            color="blue"
                        />
                        <SimpleCard
                            title="Total Orders"
                            value={reportData.totals.totalOrders.toLocaleString()}
                            icon={ShoppingCart}
                            color="purple"
                        />
                    </div>

                    {/* Sales Data Table */}
                    <SalesTable
                        data={reportData.salesData}
                        title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Sales Data`}
                    />

                    {/* Product Sales Table */}
                    <ProductSalesTable data={reportData.productSales} />
                </>
            )}
        </div>
    );
}