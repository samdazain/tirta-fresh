import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download, Printer, X } from 'lucide-react';

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

interface InvoicePreviewProps {
    invoice: Invoice;
    onClose: () => void;
    onDownload: (invoiceId: number) => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({
    invoice,
    onClose,
    onDownload
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const calculateSubtotal = () => {
        return invoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">
                        Invoice {invoice.invoiceNumber}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.print()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Printer size={16} />
                            <span>Print</span>
                        </button>
                        <button
                            onClick={() => onDownload(invoice.orderId)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                            <Download size={16} />
                            <span>Download PDF</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="p-8">
                    {/* Company Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-blue-700 mb-2">Tirta Fresh</h1>
                            <p className="text-gray-600 text-sm">Depot Air Mineral Terbaik</p>
                            <p className="text-gray-600 text-sm">Kalianyar, Kecamatan Jogoroto</p>
                            <p className="text-gray-600 text-sm">Jombang, Jawa Timur 62319</p>
                            <p className="text-gray-600 text-sm">Indonesia</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 mb-2">INVOICE</p>
                            <p className="text-gray-600">{invoice.invoiceNumber}</p>
                            <p className="text-gray-600">Pesanan: #{invoice.orderId}</p>
                            <p className="text-gray-600">
                                Tanggal: {format(parseISO(invoice.dateCreated), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="mb-8">
                        <p className="font-bold text-gray-900 mb-2">Tagihan untuk:</p>
                        <p className="text-gray-700 font-medium">{invoice.customerName}</p>
                        <p className="text-gray-600 text-sm">{invoice.village}</p>
                        <p className="text-gray-600 text-sm">{invoice.customerAddress}</p>
                    </div>

                    {/* Items Table */}
                    <div className="mb-8">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100 border-t border-b border-gray-200">
                                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                                        Deskripsi
                                    </th>
                                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-700">
                                        Jumlah
                                    </th>
                                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                                        Harga Satuan
                                    </th>
                                    <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">
                                        Subtotal
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => (
                                    <tr key={index} className="border-b border-gray-100">
                                        <td className="py-4 px-4 text-gray-700">{item.name}</td>
                                        <td className="py-4 px-4 text-center text-gray-700">{item.quantity}</td>
                                        <td className="py-4 px-4 text-right text-gray-700">
                                            {formatCurrency(item.price)}
                                        </td>
                                        <td className="py-4 px-4 text-right text-gray-700">
                                            {formatCurrency(item.price * item.quantity)}
                                        </td>
                                    </tr>
                                ))}
                                <tr className="border-t-2 border-gray-300">
                                    <td colSpan={3} className="py-4 px-4 text-right font-bold text-gray-900">
                                        Total:
                                    </td>
                                    <td className="py-4 px-4 text-right font-bold text-gray-900">
                                        {formatCurrency(calculateSubtotal())}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-bold text-gray-900 mb-2">Informasi Pembayaran:</p>
                        <p className="text-sm text-gray-700">
                            Status: <span className={`font-medium ${invoice.status === 'paid' ? 'text-green-600' :
                                invoice.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {invoice.status === 'paid' ? 'LUNAS' :
                                    invoice.status === 'pending' ? 'MENUNGGU' : 'DIBATALKAN'}
                            </span>
                        </p>
                        {invoice.datePaid && (
                            <p className="text-sm text-gray-700">
                                Tanggal Pembayaran: {format(parseISO(invoice.datePaid), 'dd MMMM yyyy', { locale: id })}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs text-gray-500">
                            Terima kasih atas kepercayaan Anda kepada Tirta Fresh
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoicePreview;
