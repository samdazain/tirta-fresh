import React from 'react';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { CheckCircle, XCircle, X } from 'lucide-react';
import OrderItemsList from './OrderItemsList';

interface OrderItem {
    id: number;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    customerName: string;
    fullAddress: string;
    village: string;
    items: OrderItem[];
    total: number;
    status: string;
    paymentProof: string | null;
    createdAt: string;
}

interface PaymentProofModalProps {
    order: Order;
    onClose: () => void;
    onAccept: () => void;
    onReject: () => void;
}

const PaymentProofModal: React.FC<PaymentProofModalProps> = ({
    order,
    onClose,
    onAccept,
    onReject
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold">Bukti Pembayaran - Pesanan #{order.id}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer hover:scale-110"
                        title="Tutup modal"
                    >
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Order Details */}
                    <div className="space-y-6">
                        {/* Customer & Order Info */}
                        <div className="bg-gray-100 rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Informasi Pesanan</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Pelanggan:</span>
                                    <span className="font-medium">{order.customerName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Desa:</span>
                                    <span className="font-medium">{order.village}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tanggal:</span>
                                    <span className="font-medium">
                                        {format(parseISO(order.createdAt), 'dd MMM yyyy, HH:mm', { locale: id })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total:</span>
                                    <span className="font-medium">{formatCurrency(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-gray-100 rounded-lg p-4">
                            <h3 className="font-semibold mb-3">Item Pesanan ({order.items.length} item)</h3>
                            <div className="bg-white rounded p-3">
                                <OrderItemsList items={order.items} showTotal={true} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Payment Proof */}
                    <div>
                        <h3 className="font-semibold mb-3">Bukti Pembayaran:</h3>
                        <div className="border rounded-lg flex items-center justify-center p-2 relative h-96 bg-gray-50">
                            {order.paymentProof ? (
                                <Image
                                    src={order.paymentProof}
                                    alt="Bukti Pembayaran"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 600px"
                                    style={{ objectFit: 'contain' }}
                                    className="rounded"
                                />
                            ) : (
                                <div className="text-gray-500">Tidak ada bukti pembayaran</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="border-t pt-4 mt-6">
                    <p className="text-gray-700 mb-4">Verifikasi bukti pembayaran dan perbarui status pesanan:</p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-all duration-200 cursor-pointer hover:shadow-md"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={onReject}
                            className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 flex items-center gap-2 transition-all duration-200 cursor-pointer hover:shadow-md transform hover:scale-[1.02]"
                        >
                            <XCircle size={18} />
                            <span>Tangguhkan</span>
                        </button>
                        <button
                            onClick={onAccept}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 transition-all duration-200 cursor-pointer hover:shadow-md transform hover:scale-[1.02]"
                        >
                            <CheckCircle size={18} />
                            <span>Selesai</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentProofModal;
