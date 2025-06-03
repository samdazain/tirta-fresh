'use client';

import { useState, useCallback, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import OrdersFilters from '@/components/admin/Orders/OrdersFilters';
import OrdersTable from '@/components/admin/Orders/OrdersTable';
import PaymentProofModal from '@/components/admin/Orders/PaymentProofModal';
import OrderDetailsModal from '@/components/admin/Orders/OrderDetailsModal';

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
                throw new Error('Gagal memuat pesanan');
            }

            const data = await response.json();
            setOrders(data.orders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
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

    const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Gagal memperbarui status pesanan');
            }

            const data = await response.json();

            // Update order in state
            setOrders(orders.map(order =>
                order.id === orderId ? data.order : order
            ));

            // Close modals
            setViewPaymentProof(false);
            setViewOrderDetails(false);
            setSelectedOrder(null);

            return true;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Gagal memperbarui status pesanan');
            return false;
        }
    };

    const handleAcceptPayment = async () => {
        if (!selectedOrder) return;
        await handleUpdateOrderStatus(selectedOrder.id, 'SELESAI');
    };

    const handleRejectPayment = async () => {
        if (!selectedOrder) return;
        await handleUpdateOrderStatus(selectedOrder.id, 'DITANGGUHKAN');
    };

    // Filter orders based on search term
    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toString().includes(searchTerm) ||
            order.village.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manajemen Pesanan</h1>
                <div className="text-sm text-gray-500">
                    {filteredOrders.length} dari {orders.length} pesanan
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
            <OrdersFilters
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                onSearchChange={setSearchTerm}
                onStatusChange={setStatusFilter}
            />

            {/* Orders list */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="h-8 w-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredOrders.length > 0 ? (
                <OrdersTable
                    orders={filteredOrders}
                    onViewPaymentProof={handleViewPaymentProof}
                    onViewOrderDetails={handleViewOrderDetails}
                />
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <AlertCircle size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada pesanan ditemukan</h3>
                    <p className="text-gray-500">
                        {searchTerm || statusFilter !== 'all'
                            ? "Coba sesuaikan kriteria pencarian atau filter Anda."
                            : "Belum ada pesanan yang dibuat."}
                    </p>
                </div>
            )}

            {/* Modals */}
            {viewPaymentProof && selectedOrder && (
                <PaymentProofModal
                    order={selectedOrder}
                    onClose={() => {
                        setViewPaymentProof(false);
                        setSelectedOrder(null);
                    }}
                    onAccept={handleAcceptPayment}
                    onReject={handleRejectPayment}
                />
            )}

            {viewOrderDetails && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => {
                        setViewOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                />
            )}
        </div>
    );
}
