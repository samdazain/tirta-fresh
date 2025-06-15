import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download, Eye } from 'lucide-react';

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

interface InvoicesTableProps {
    invoices: Invoice[];
    onViewInvoice: (invoice: Invoice) => void;
    onDownloadInvoice: (invoiceId: number) => void;
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
    invoices,
    onViewInvoice,
    onDownloadInvoice
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";

        switch (status) {
            case 'paid':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'pending':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'cancelled':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'paid':
                return 'Lunas';
            case 'pending':
                return 'Menunggu';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Invoice
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pesanan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pelanggan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {invoice.invoiceNumber}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        #{invoice.orderId}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <div className="text-sm font-medium text-gray-900">
                                            {invoice.customerName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {invoice.village}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {format(parseISO(invoice.dateCreated), 'dd MMM yyyy', { locale: id })}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {format(parseISO(invoice.dateCreated), 'HH:mm', { locale: id })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(invoice.amount)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={getStatusBadge(invoice.status)}>
                                        {getStatusText(invoice.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onViewInvoice(invoice)}
                                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-all duration-200 cursor-pointer transform hover:scale-110"
                                            title="Lihat Invoice"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => onDownloadInvoice(invoice.orderId)}
                                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-all duration-200 cursor-pointer transform hover:scale-110"
                                            title="Download Invoice"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InvoicesTable;
