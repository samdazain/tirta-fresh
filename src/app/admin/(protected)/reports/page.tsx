'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

import ReportFilters from '@/components/admin/Reports/ReportFilters';
import ReportSummaryCards from '@/components/admin/Reports/ReportSummaryCards';
import ReportDetailTable from '@/components/admin/Reports/ReportDetailTable';
import ProductSalesTable from '@/components/admin/Reports/ProductSalesTable';

interface ReportData {
    reportType: string;
    period: string;
    reports: Array<{
        period: string;
        dateRange: { start: string; end: string };
        totalRevenue: number;
        totalItems: number;
        totalOrders: number;
        itemBreakdown: Array<{
            name: string;
            quantity: number;
            revenue: number;
            category: string;
        }>;
    }>;
    summary: {
        totalRevenue: number;
        totalItems: number;
        totalOrders: number;
        averageOrderValue: number;
    };
    productSales: Array<{
        name: string;
        quantity: number;
        revenue: number;
        category: string;
    }>;
    metadata: {
        generatedAt: string;
    };
}

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('daily');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getPeriodsForTab = (tab: string) => {
        const periodMap = {
            daily: 7,
            weekly: 4,
            monthly: 12,
            quarterly: 4,
            yearly: 5
        };
        return periodMap[tab as keyof typeof periodMap] || 7;
    };

    const fetchReportData = useCallback(async (reportType: string, year?: number) => {
        setLoading(true);
        setError(null);

        try {
            const periods = getPeriodsForTab(reportType);
            const queryParams = new URLSearchParams({
                type: reportType,
                periods: periods.toString()
            });

            if (reportType === 'yearly' && year) {
                queryParams.append('year', year.toString());
            }

            const response = await fetch(`/api/admin/reports?${queryParams}`);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.details || `Gagal memuat laporan ${reportType}`);
            }

            const data = await response.json();
            setReportData(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchReportData(activeTab, selectedYear);
    }, [activeTab, selectedYear, fetchReportData]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
    };

    const handleRefresh = () => {
        fetchReportData(activeTab, selectedYear);
    };

    const handleExport = async () => {
        try {
            const periods = getPeriodsForTab(activeTab);
            const queryParams = new URLSearchParams({
                type: activeTab,
                periods: periods.toString()
            });

            if (activeTab === 'yearly') {
                queryParams.append('year', selectedYear.toString());
            }

            const response = await fetch(`/api/admin/reports/download?${queryParams}`);

            if (!response.ok) {
                throw new Error('Gagal mengunduh laporan');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            const filename = `tirta-fresh-laporan-${activeTab}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error downloading report:', error);
            setError('Gagal mengunduh laporan PDF');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getReportTitle = () => {
        const titles = {
            daily: 'Laporan Harian',
            weekly: 'Laporan Mingguan',
            monthly: 'Laporan Bulanan',
            quarterly: 'Laporan Kuartalan',
            yearly: 'Laporan Tahunan'
        };
        return titles[activeTab as keyof typeof titles] || 'Laporan Penjualan';
    };

    const lastUpdated = reportData?.metadata?.generatedAt ?
        format(new Date(reportData.metadata.generatedAt), 'dd MMM yyyy HH:mm', { locale: id }) :
        undefined;

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                    <p className="text-gray-600">Lihat data penjualan dan performa produk</p>
                </div>

                <div className="flex justify-center py-20">
                    <div className="text-center">
                        <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Memuat laporan penjualan...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 print:space-y-4">
            {/* Header */}
            <div className="print:hidden">
                <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
                <p className="text-gray-600">Lihat data penjualan dan performa produk</p>
            </div>

            {/* Print Header */}
            <div className="hidden print:block text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tirta Fresh</h1>
                <h2 className="text-xl font-semibold text-gray-700">{getReportTitle()}</h2>
                {reportData && (
                    <p className="text-sm text-gray-600 mt-2">
                        Periode: {reportData.period} | Dibuat: {lastUpdated}
                    </p>
                )}
            </div>

            {/* Filters */}
            <div className="print:hidden">
                <ReportFilters
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    selectedYear={selectedYear}
                    onYearChange={handleYearChange}
                    onRefresh={handleRefresh}
                    onExport={handleExport}
                    onPrint={handlePrint}
                    loading={loading}
                    lastUpdated={lastUpdated}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 flex items-center print:hidden">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Content */}
            {!error && reportData && (
                <>
                    {/* Summary Cards */}
                    <ReportSummaryCards data={reportData.summary} />

                    {/* Report Detail Table */}
                    <ReportDetailTable
                        title={`Detail ${getReportTitle()}`}
                        data={reportData.reports}
                        reportType={reportData.reportType}
                    />

                    {/* Product Sales Table */}
                    <ProductSalesTable data={reportData.productSales} />
                </>
            )}
        </div>
    );
}