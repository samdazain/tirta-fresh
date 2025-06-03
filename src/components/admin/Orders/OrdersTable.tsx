import React from 'react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { FileText, Package } from 'lucide-react';
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

interface OrdersTableProps {
    orders: Order[];
    onViewPaymentProof: (order: Order) => void;
    onViewOrderDetails: (order: Order) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
    orders,
    onViewPaymentProof,
    onViewOrderDetails
}) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID Pesanan
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pelanggan & Alamat
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Item Pesanan
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
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-200 cursor-default">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        #{order.id}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <div className="text-sm font-medium text-gray-900">
                                            {order.customerName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {order.village}
                                        </div>
                                        <div className="text-xs text-gray-400 truncate">
                                            {order.fullAddress}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <div className="text-sm text-gray-900 mb-1">
                                            {order.items.length} item
                                        </div>
                                        <OrderItemsList items={order.items.slice(0, 2)} compact={true} />
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {format(parseISO(order.createdAt), 'dd MMM yyyy', { locale: id })}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {format(parseISO(order.createdAt), 'HH:mm', { locale: id })}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatCurrency(order.total)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <OrderStatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onViewOrderDetails(order)}
                                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-all duration-200 cursor-pointer transform hover:scale-110"
                                            title="Lihat Detail Pesanan"
                                        >
                                            <Package size={16} />
                                        </button>
                                        <button
                                            onClick={() => onViewPaymentProof(order)}
                                            className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-all duration-200 cursor-pointer transform hover:scale-110"
                                            title="Lihat Bukti Pembayaran"
                                        >
                                            <FileText size={16} />
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

export default OrdersTable;
