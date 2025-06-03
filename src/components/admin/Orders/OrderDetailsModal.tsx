import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { X, MapPin, User, Calendar, Package } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
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
    updatedAt: string;
}

interface OrderDetailsModalProps {
    order: Order;
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const shippingCost = 5000;
    const subtotal = order.total - shippingCost;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Detail Pesanan #{order.id}
                            </h2>
                            <div className="mt-2">
                                <OrderStatusBadge status={order.status} />
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer hover:scale-110"
                            title="Tutup modal"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                                <User size={18} className="mr-2" />
                                Informasi Pelanggan
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-gray-600">Nama:</span>
                                    <p className="font-medium">{order.customerName}</p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600 flex items-center">
                                        <MapPin size={14} className="mr-1" />
                                        Alamat:
                                    </span>
                                    <p className="font-medium">{order.village}</p>
                                    <p className="text-sm text-gray-700">{order.fullAddress}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                                <Calendar size={18} className="mr-2" />
                                Informasi Pesanan
                            </h3>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-sm text-gray-600">Tanggal Dibuat:</span>
                                    <p className="font-medium">
                                        {format(parseISO(order.createdAt), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Terakhir Diperbarui:</span>
                                    <p className="font-medium">
                                        {format(parseISO(order.updatedAt), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6">
                        <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                            <Package size={18} className="mr-2" />
                            Item Pesanan ({order.items.length} item)
                        </h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <OrderItemsList items={order.items} showTotal={false} />
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Ringkasan Pembayaran</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ongkos Kirim:</span>
                                    <span className="font-medium">{formatCurrency(shippingCost)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-300">
                                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        {formatCurrency(order.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 cursor-pointer hover:shadow-md transform hover:scale-[1.02]"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
