'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle, Search, Calendar, RefreshCw } from 'lucide-react';
import InvoicesTable from '@/components/admin/Invoices/InvoicesTable';
import InvoicePreview from '@/components/admin/Invoices/InvoicePreview';

interface InvoiceItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface Invoice {
    id: number;
    orderId: number;
    customerName: string;
    customerAddress: string;
    village: string;
    items: InvoiceItem[];
    amount: number;
    status: 'paid' | 'pending' | 'cancelled';
    dateCreated: string;
    datePaid?: string;
    invoiceNumber: string;
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [timeframeFilter, setTimeframeFilter] = useState('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);

    const fetchInvoices = useCallback(async (isRefresh = false) => {
        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        try {
            const queryParams = new URLSearchParams();
            if (timeframeFilter !== 'all') {
                queryParams.append('timeframe', timeframeFilter);
            }

            const response = await fetch(`/api/admin/invoices?${queryParams}`);

            if (!response.ok) {
                throw new Error('Gagal memuat invoice');
            }

            const data = await response.json();
            setInvoices(data.invoices);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        } finally {
            if (isRefresh) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    }, [timeframeFilter]);

    useEffect(() => {
        fetchInvoices();
    }, [fetchInvoices]);

    const handleRefresh = useCallback(() => {
        fetchInvoices(true);
    }, [fetchInvoices]);

    const handleViewInvoice = async (invoice: Invoice) => {
        try {
            const response = await fetch(`/api/admin/invoices/${invoice.orderId}/view`);
            if (response.ok) {
                const data = await response.json();
                setSelectedInvoice(data.invoice);
                setShowInvoicePreview(true);
            }
        } catch (error) {
            console.error('Error fetching invoice details:', error);
            setError('Gagal memuat detail invoice');
        }
    };

    const handleDownloadInvoice = async (invoiceId: number) => {
        try {
            const response = await fetch(`/api/admin/invoices/${invoiceId}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;

                // Get filename from response headers or generate default
                const contentDisposition = response.headers.get('content-disposition');
                let filename = `invoice-${invoiceId}.pdf`;
                if (contentDisposition) {
                    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                    if (filenameMatch) {
                        filename = filenameMatch[1];
                    }
                }

                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                throw new Error('Failed to download PDF');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);
            setError('Gagal mengunduh invoice PDF');
        }
    };

    // Filter invoices based on search term
    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const searchLower = searchTerm.toLowerCase();
            return (
                invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
                invoice.orderId.toString().includes(searchLower) ||
                invoice.customerName.toLowerCase().includes(searchLower)
            );
        });
    }, [invoices, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Invoice</h1>
                <div className="text-sm text-gray-500">
                    {filteredInvoices.length} dari {invoices.length} invoice
                    {refreshing && (
                        <span className="ml-2 text-blue-600">• Memperbarui...</span>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
                    <div className="flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-600 cursor-pointer transition-colors duration-200 hover:scale-110"
                            title="Tutup pesan error"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nomor invoice, pesanan, atau nama pelanggan..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
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
                                onChange={(e) => setTimeframeFilter(e.target.value)}
                                className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
                            >
                                <option value="all">Semua Waktu</option>
                                <option value="today">Hari Ini</option>
                                <option value="week">Minggu Ini</option>
                                <option value="month">Bulan Ini</option>
                            </select>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2 border border-gray-300 rounded-md hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title="Refresh data invoice"
                        >
                            <RefreshCw
                                size={18}
                                className={`text-gray-500 ${refreshing ? 'animate-spin' : ''}`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoices list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredInvoices.length > 0 ? (
                <InvoicesTable
                    invoices={filteredInvoices}
                    onViewInvoice={handleViewInvoice}
                    onDownloadInvoice={handleDownloadInvoice}
                />
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada invoice ditemukan</h3>
                    <p className="text-gray-500">
                        {searchTerm || timeframeFilter !== 'all'
                            ? "Coba sesuaikan kriteria pencarian atau filter Anda."
                            : "Belum ada invoice yang dibuat dari pesanan yang selesai."}
                    </p>
                </div>
            )}

            {/* Invoice preview modal */}
            {showInvoicePreview && selectedInvoice && (
                <InvoicePreview
                    invoice={selectedInvoice}
                    onClose={() => {
                        setShowInvoicePreview(false);
                        setSelectedInvoice(null);
                    }}
                    onDownload={handleDownloadInvoice}
                />
            )}
        </div>
    );
}
