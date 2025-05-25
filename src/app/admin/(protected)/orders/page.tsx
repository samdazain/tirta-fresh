'use client';

import { useState, useCallback, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import {
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Truck,
    Package2,
    Clock,
    AlertCircle,
} from 'lucide-react';
import Image from 'next/image';

interface OrderItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface Order {
    id: number;
    customerName: string;
    items: OrderItem[];
    total: number;
    address: string;
    paymentProof: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface PaymentViewModalProps {
    order: Order;
    onClose: () => void;
    onAccept: () => void;
    onReject: () => void;
}

const PaymentViewModal: React.FC<PaymentViewModalProps> = ({
    order,
    onClose,
    onAccept,
    onReject
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Payment Proof - Order #{order.id}</h2>

                <div className="mb-6">
                    <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Customer:</span>
                            <span className="font-medium">{order.customerName}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Order Date:</span>
                            <span className="font-medium">
                                {format(parseISO(order.createdAt), 'dd MMM yyyy, HH:mm')}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-medium">Rp {order.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium mb-2">Payment Proof:</h3>
                        <div className="border rounded-lg flex items-center justify-center p-2 relative h-80">
                            <Image
                                src={order.paymentProof}
                                alt="Payment Proof"
                                fill
                                sizes="(max-width: 768px) 100vw, 600px"
                                style={{ objectFit: 'contain' }}
                                onError={() => {
                                    // Next.js Image doesn't support onError directly the same way
                                    // This is a placeholder alternative
                                    const imgElement = document.querySelector(`[alt="Payment Proof"]`);
                                    if (imgElement) {
                                        imgElement.setAttribute('src', "https://via.placeholder.com/400x300?text=No+Image+Available");
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>

                {order.status === 'pending' && (
                    <div className="border-t pt-4">
                        <p className="text-gray-700 mb-4">Verify the payment proof and update the order status:</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={onReject}
                                className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 flex items-center gap-2"
                            >
                                <XCircle size={18} />
                                <span>Reject Payment</span>
                            </button>
                            <button
                                onClick={onAccept}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                            >
                                <CheckCircle size={18} />
                                <span>Accept Payment</span>
                            </button>
                        </div>
                    </div>
                )}

                {order.status !== 'pending' && (
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Close
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

interface OrderDetailsProps {
    order: Order;
    onClose: () => void;
    onStatusUpdate: (orderId: number, status: string) => void;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onClose, onStatusUpdate }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            // Call API to update status
            await onStatusUpdate(order.id, newStatus);
            setIsUpdating(false);
        } catch (error) {
            console.error('Error updating status:', error);
            setIsUpdating(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Order #{order.id}</h2>
                    <OrderStatusBadge status={order.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="mb-1"><span className="font-medium">Name:</span> {order.customerName}</p>
                            <p><span className="font-medium">Delivery Address:</span> {order.address}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-900 mb-2">Order Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="mb-1">
                                <span className="font-medium">Created:</span> {format(parseISO(order.createdAt), 'PPP p')}
                            </p>
                            <p>
                                <span className="font-medium">Last Updated:</span> {format(parseISO(order.updatedAt), 'PPP p')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Ordered Items</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                    <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {order.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="py-2">{item.name}</td>
                                        <td className="py-2 text-right">Rp {item.price.toLocaleString()}</td>
                                        <td className="py-2 text-right">{item.quantity}</td>
                                        <td className="py-2 text-right">Rp {(item.price * item.quantity).toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-100">
                                    <td className="py-2 font-medium" colSpan={3}>Total</td>
                                    <td className="py-2 font-medium text-right">Rp {order.total.toLocaleString()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="mb-6">
                        <h3 className="font-medium text-gray-900 mb-2">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                            {order.status !== 'processing' && (
                                <button
                                    onClick={() => handleStatusUpdate('processing')}
                                    disabled={isUpdating}
                                    className="px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 flex items-center gap-2"
                                >
                                    <Package2 size={16} />
                                    <span>Processing</span>
                                </button>
                            )}
                            {(order.status === 'processing' || order.status === 'payment_rejected') && (
                                <button
                                    onClick={() => handleStatusUpdate('shipped')}
                                    disabled={isUpdating}
                                    className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-100 flex items-center gap-2"
                                >
                                    <Truck size={16} />
                                    <span>Shipped</span>
                                </button>
                            )}
                            {(order.status === 'shipped' || order.status === 'processing') && (
                                <button
                                    onClick={() => handleStatusUpdate('completed')}
                                    disabled={isUpdating}
                                    className="px-3 py-2 bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 flex items-center gap-2"
                                >
                                    <CheckCircle size={16} />
                                    <span>Completed</span>
                                </button>
                            )}
                            {order.status !== 'cancelled' && (
                                <button
                                    onClick={() => handleStatusUpdate('cancelled')}
                                    disabled={isUpdating}
                                    className="px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-md hover:bg-red-100 flex items-center gap-2"
                                >
                                    <XCircle size={16} />
                                    <span>Cancel Order</span>
                                </button>
                            )}

                            {isUpdating && (
                                <span className="ml-2 flex items-center">
                                    <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Updating...
                                </span>
                            )}
                        </div>
                    </div>
                )}

                <div className="border-t pt-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

interface OrderStatusBadgeProps {
    status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
    let bgColor = '';
    let textColor = '';
    let icon = null;
    let label = '';

    switch (status) {
        case 'pending':
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            icon = <Clock size={14} className="mr-1" />;
            label = 'Pending';
            break;
        case 'payment_rejected':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            icon = <XCircle size={14} className="mr-1" />;
            label = 'Payment Rejected';
            break;
        case 'processing':
            bgColor = 'bg-blue-100';
            textColor = 'text-blue-800';
            icon = <Package2 size={14} className="mr-1" />;
            label = 'Processing';
            break;
        case 'shipped':
            bgColor = 'bg-indigo-100';
            textColor = 'text-indigo-800';
            icon = <Truck size={14} className="mr-1" />;
            label = 'Shipped';
            break;
        case 'completed':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            icon = <CheckCircle size={14} className="mr-1" />;
            label = 'Completed';
            break;
        case 'cancelled':
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            icon = <AlertCircle size={14} className="mr-1" />;
            label = 'Cancelled';
            break;
        default:
            bgColor = 'bg-gray-100';
            textColor = 'text-gray-800';
            label = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }

    return (
        <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
            {icon}
            {label}
        </span>
    );
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewPaymentProof, setViewPaymentProof] = useState(false);
    const [viewOrderDetails, setViewOrderDetails] = useState(false);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();

            if (statusFilter !== 'all') {
                queryParams.append('status', statusFilter);
            }

            const response = await fetch(`/api/admin/orders?${queryParams}`);

            if (!response.ok) {
                throw new Error('Failed to fetch orders');
            }

            const data = await response.json();
            setOrders(data.orders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    // Fetch orders on component mount and when status filter changes
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleViewPaymentProof = (order: Order) => {
        setSelectedOrder(order);
        setViewPaymentProof(true);
    };

    const handleViewOrderDetails = (order: Order) => {
        setSelectedOrder(order);
        setViewOrderDetails(true);
    };

    const handleAcceptPayment = async () => {
        if (!selectedOrder) return;

        try {
            const response = await fetch(`/api/admin/orders/${selectedOrder.id}/payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'accept' }),
            });

            if (!response.ok) {
                throw new Error('Failed to accept payment');
            }

            const data = await response.json();

            // Update order in state
            setOrders(orders.map(order =>
                order.id === selectedOrder.id ? { ...order, status: data.order.status } : order
            ));

            // Close modal
            setViewPaymentProof(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to process payment');
        }
    };

    const handleRejectPayment = async () => {
        if (!selectedOrder) return;

        try {
            const response = await fetch(`/api/admin/orders/${selectedOrder.id}/payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'reject' }),
            });

            if (!response.ok) {
                throw new Error('Failed to reject payment');
            }

            const data = await response.json();

            // Update order in state
            setOrders(orders.map(order =>
                order.id === selectedOrder.id ? { ...order, status: data.order.status } : order
            ));

            // Close modal
            setViewPaymentProof(false);
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to process payment');
        }
    };

    const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            // In a real application, you would call an API to update the status
            // This is just a placeholder for demonstration
            // const response = await fetch(`/api/admin/orders/${orderId}/status`, {
            //   method: 'PATCH',
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            //   body: JSON.stringify({ status: newStatus }),
            // });

            // Simulating a successful API call for demo purposes
            // In production, you'd check the response and handle errors

            // Update order in state
            setOrders(orders.map(order =>
                order.id === orderId
                    ? {
                        ...order,
                        status: newStatus,
                        updatedAt: new Date().toISOString()
                    }
                    : order
            ));

            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to update order status');
            return false;
        }
    };

    // Filter orders based on search term
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm);

        return matchesSearch;
    });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Orders Management</h1>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
                    {error}
                    <button className="float-right" onClick={() => setError(null)}>×</button>
                </div>
            )}

            {/* Search and filter */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex-1">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <Search size={18} className="text-gray-500" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search orders by customer name or order ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded-md"
                        >
                            <option value="all">All Orders</option>
                            <option value="pending">Pending Payment</option>
                            <option value="payment_rejected">Payment Rejected</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredOrders.length > 0 ? (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
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
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {order.customerName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {format(parseISO(order.createdAt), 'dd MMM yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            Rp {order.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleViewOrderDetails(order)}
                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                title="View Order Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {order.status === 'pending' && (
                                                <button
                                                    onClick={() => handleViewPaymentProof(order)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="View Payment Proof"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all'
                            ? "Try adjusting your search or filter criteria."
                            : "No orders have been placed yet."}
                    </p>
                </div>
            )}

            {/* Payment proof modal */}
            {viewPaymentProof && selectedOrder && (
                <PaymentViewModal
                    order={selectedOrder}
                    onClose={() => setViewPaymentProof(false)}
                    onAccept={handleAcceptPayment}
                    onReject={handleRejectPayment}
                />
            )}

            {/* Order details modal */}
            {viewOrderDetails && selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    onClose={() => setViewOrderDetails(false)}
                    onStatusUpdate={handleUpdateOrderStatus}
                />
            )}
        </div>
    );
}
