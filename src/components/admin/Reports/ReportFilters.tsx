'use client';

import React from 'react';
import { Calendar, Download, Printer, RefreshCw } from 'lucide-react';

interface ReportFiltersProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    selectedYear: number;
    onYearChange: (year: number) => void;
    onRefresh: () => void;
    onExport: () => void;
    onPrint: () => void;
    loading?: boolean;
    lastUpdated?: string;
}

const tabs = [
    { key: 'daily', label: 'Harian', periods: 7 },
    { key: 'weekly', label: 'Mingguan', periods: 4 },
    { key: 'monthly', label: 'Bulanan', periods: 12 },
    { key: 'quarterly', label: 'Kuartalan', periods: 4 },
    { key: 'yearly', label: 'Tahunan', periods: 5 },
];

export default function ReportFilters({
    activeTab,
    onTabChange,
    selectedYear,
    onYearChange,
    onRefresh,
    onExport,
    onPrint,
    loading = false,
    lastUpdated
}: ReportFiltersProps) {
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col space-y-4">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${activeTab === tab.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Controls Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Year Selector (only for yearly reports) */}
                    {activeTab === 'yearly' && (
                        <div className="flex items-center space-x-3">
                            <label className="text-sm font-medium text-gray-700">Tahun:</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => onYearChange(parseInt(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Last Updated Info */}
                    {lastUpdated && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-1" />
                            <span>Diperbarui: {lastUpdated}</span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={onRefresh}
                            disabled={loading}
                            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            title="Refresh Data"
                        >
                            <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                            <span>Refresh</span>
                        </button>

                        <button
                            onClick={onPrint}
                            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                            title="Cetak Laporan"
                        >
                            <Printer size={16} className="mr-2" />
                            <span>Cetak</span>
                        </button>

                        <button
                            onClick={onExport}
                            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                            title="Download PDF"
                        >
                            <Download size={16} className="mr-2" />
                            <span>Download PDF</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}