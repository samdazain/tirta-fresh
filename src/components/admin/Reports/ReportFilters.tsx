'use client';

import React from 'react';
import { Calendar, Download, Printer, RefreshCw } from 'lucide-react';

interface ReportFiltersProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onRefresh: () => void;
    onExport: () => void;
    onPrint: () => void;
    loading?: boolean;
    lastUpdated?: string;
}

const tabs = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'yearly', label: 'Yearly' },
    { key: 'all-time', label: 'All Time' },
];

export default function ReportFilters({
    activeTab,
    onTabChange,
    onRefresh,
    onExport,
    onPrint,
    loading = false,
    lastUpdated
}: ReportFiltersProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => onTabChange(tab.key)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                    {lastUpdated && (
                        <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={16} className="mr-1" />
                            <span>Updated: {lastUpdated}</span>
                        </div>
                    )}

                    <button
                        onClick={onRefresh}
                        disabled={loading}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                        <span>Refresh</span>
                    </button>

                    <button
                        onClick={onPrint}
                        className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        <Printer size={16} className="mr-2" />
                        <span>Print</span>
                    </button>

                    <button
                        onClick={onExport}
                        className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <Download size={16} className="mr-2" />
                        <span>Export</span>
                    </button>
                </div>
            </div>
        </div>
    );
}