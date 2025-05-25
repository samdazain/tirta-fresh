'use client';

import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
    Search,
    Download,
    FileText,
    ChevronLeft,
    ChevronRight,
    Printer
} from 'lucide-react';

interface Invoice {
    id: number;
    orderId: number;
    customerName: string;
    amount: number;
    status: 'paid' | 'pending' | 'cancelled';
    dateCreated: string;
    datePaid?: string;
}

interface InvoicePreviewProps {
    invoice: Invoice;
    onClose: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Invoice #{invoice.id}</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-3 py-1 bg-blue-600 text-white rounded-md flex items-center gap-1"
                        >
                            <Printer size={16} />
                            <span>Print</span>
                        </button>
                        <button
                            onClick={() => {
                                // In a real application, you would download a PDF
                                alert('Download functionality would be implemented here');
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded-md flex items-center gap-1"
                        >
                            <Download size={16} />
                            <span>Download</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <div className="border p-6 mb-6">
                    <div className="flex justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-blue-700">Tirta Fresh</h1>
                            <p className="text-sm text-gray-600">Depot Air Mineral Terbaik</p>
                            <p className="text-sm text-gray-600">Jl. Raya Tuban No. 123</p>
                            <p className="text-sm text-gray-600">Tuban, Jawa Timur 62319</p>
                            <p className="text-sm text-gray-600">Indonesia</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold">INVOICE</p>
                            <p className="text-gray-600">#{invoice.id}</p>
                            <p className="text-gray-600">Order: #{invoice.orderId}</p>
                            <p className="text-gray-600">Date: {format(parseISO(invoice.dateCreated), 'dd MMM yyyy')}</p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="font-bold mb-2">Bill To:</p>
                        <p>{invoice.customerName}</p>
                    </div>

                    <div className="mb-8">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-100 border-t border-b">
                                    <th className="py-2 px-4 text-left">Description</th>
                                    <th className="py-2 px-4 text-center">Quantity</th>
                                    <th className="py-2 px-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* In a real app, you would map over actual line items */}
                                <tr className="border-b">
                                    <td className="py-3 px-4">Water Products</td>
                                    <td className="py-3 px-4 text-center">1</td>
                                    <td className="py-3 px-4 text-right">Rp {invoice.amount.toLocaleString()}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className="py-3 px-4 text-right font-bold">Total:</td>
                                    <td className="py-3 px-4 text-right font-bold">Rp {invoice.amount.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-sm text-gray-600">
                        <p className="font-bold mb-2">Payment Information:</p>
                        <p>Status: <span className={`font-medium ${invoice.status === 'paid' ? 'text-green-600' : invoice.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>{invoice.status.toUpperCase()}</span></p>
                        {invoice.datePaid && <p>Payment Date: {format(parseISO(invoice.datePaid), 'dd MMM yyyy')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);

    const itemsPerPage = 10;

    // Load sample data
    useEffect(() => {
        // In a real app, you would fetch from an API
        setTimeout(() => {
            const sampleInvoices: Invoice[] = Array.from({ length: 25 }).map((_, i) => ({
                id: 1000 + i,
                orderId: 100 + i,
                customerName: `Customer ${i + 1}`,
                amount: Math.floor(Math.random() * 500000) + 25000,
                status: ['paid', 'pending', 'cancelled'][Math.floor(Math.random() * 3)] as 'paid' | 'pending' | 'cancelled',
                dateCreated: new Date(2023, 10, 30 - i).toISOString(),
                datePaid: Math.random() > 0.3 ? new Date(2023, 10, 30 - i + Math.floor(Math.random() * 3)).toISOString() : undefined,
            }));

            setInvoices(sampleInvoices);
            setLoading(false);
        }, 800);
    }, []);

    // Filter invoices based on search term
    const filteredInvoices = invoices.filter(invoice => {
        const searchLower = searchTerm.toLowerCase();
        return (
            invoice.id.toString().includes(searchLower) ||
            invoice.orderId.toString().includes(searchLower) ||
            invoice.customerName.toLowerCase().includes(searchLower)
        );
    });

    // Pagination
    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleViewInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setShowInvoicePreview(true);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Invoices</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
                    {error}
                    <button className="float-right" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={18} className="text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by invoice number, order number, or customer name..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            {/* Invoices list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : paginatedInvoices.length > 0 ? (
                <>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Invoice
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium">
                                                #{invoice.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                #{invoice.orderId}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {invoice.customerName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {format(parseISO(invoice.dateCreated), 'dd MMM yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                Rp {invoice.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${invoice.status === 'paid'
                                                        ? 'bg-green-100 text-green-800'
                                                        : invoice.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'}`}
                                                >
                                                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleViewInvoice(invoice)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3 inline-flex items-center gap-1"
                                                >
                                                    <FileText size={16} />
                                                    <span>View</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // In a real app, you would download a PDF
                                                        alert(`Downloading invoice #${invoice.id}`);
                                                    }}
                                                    className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                                                >
                                                    <Download size={16} />
                                                    <span>Download</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6">
                            <p className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
                            </p>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                                    // Logic to show pages around current page
                                    let pageToShow: number;
                                    if (totalPages <= 5) {
                                        pageToShow = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageToShow = i + 1;
                                        if (i === 4) pageToShow = totalPages;
                                        if (i === 3 && totalPages > 5) pageToShow = -1; // Ellipsis
                                    } else if (currentPage >= totalPages - 2) {
                                        pageToShow = totalPages - 4 + i;
                                        if (i === 0) pageToShow = 1;
                                        if (i === 1 && totalPages > 5) pageToShow = -1; // Ellipsis
                                    } else {
                                        if (i === 0) pageToShow = 1;
                                        else if (i === 1) pageToShow = -1; // Ellipsis
                                        else if (i === 4) pageToShow = totalPages;
                                        else if (i === 3) pageToShow = currentPage + 1;
                                        else pageToShow = currentPage;
                                    }

                                    if (pageToShow === -1) {
                                        return <span key={i} className="px-3 py-2">...</span>;
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(pageToShow)}
                                            className={`w-10 h-10 rounded-md ${currentPage === pageToShow
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-100'
                                                }`}
                                        >
                                            {pageToShow}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                    <p className="text-gray-500">
                        {searchTerm
                            ? "Try adjusting your search criteria."
                            : "No invoices have been generated yet."}
                    </p>
                </div>
            )}

            {/* Invoice preview modal */}
            {showInvoicePreview && selectedInvoice && (
                <InvoicePreview
                    invoice={selectedInvoice}
                    onClose={() => setShowInvoicePreview(false)}
                />
            )}
        </div>
    );
}
