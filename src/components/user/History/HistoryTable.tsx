'use client';

import React, { JSX, useState, useEffect } from "react";
import RowTable from "./RowTable";

interface OrderHistory {
    id: number;
    customerName: string;
    itemCount: string;
    location: string;
    address: string;
    status: "Ditangguhkan" | "Selesai" | "Dalam Pengiriman";
    createdAt: string;
}

export default function HistoryTable(): JSX.Element {
    const [orders, setOrders] = useState<OrderHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/history');

                if (!response.ok) {
                    throw new Error('Failed to fetch order history');
                }

                const data = await response.json();

                // Map status to match component expectations
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mappedOrders = data.map((order: any) => ({
                    ...order,
                    status: mapOrderStatus(order.status)
                }));

                setOrders(mappedOrders);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching order history:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, []);

    // Map database status to display status
    const mapOrderStatus = (dbStatus: string): "Ditangguhkan" | "Selesai" | "Dalam Pengiriman" => {
        switch (dbStatus) {
            case 'DITANGGUHKAN':
                return 'Ditangguhkan';
            case 'SELESAI':
                return 'Selesai';
            case 'DALAM_PENGIRIMAN':
                return 'Dalam Pengiriman';
            default:
                return 'Dalam Pengiriman';
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span className="ml-3 text-white">Memuat riwayat pesanan...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="text-white text-center">
                        <p className="text-lg font-semibold mb-2">Gagal memuat riwayat pesanan</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                </div>
            );
        }

        if (orders.length === 0) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="text-white text-center">
                        <p className="text-lg font-semibold mb-2">Tidak ada pesanan dalam 2 hari terakhir</p>
                        <p className="text-sm opacity-80">Pesanan Anda akan muncul di sini setelah dibuat</p>
                    </div>
                </div>
            );
        }

        return (
            <>
                {/* Table Header */}
                <div
                    data-property-1="Default"
                    data-show-leading-checkbox="false"
                    className="w-[1073px] mb-4 py-4 bg-white rounded-[10px] border-b border-black/20 inline-flex justify-center items-center gap-8"
                >
                    <div className="flex-1 flex justify-center items-center gap-8">
                        <div className="w-40 inline-flex flex-col justify-start items-start gap-0.5">
                            <div className="self-stretch text-center justify-start text-[#101113] text-sm font-bold leading-tight">
                                Nama Pemesan
                            </div>
                        </div>
                        <div className="w-40 inline-flex flex-col justify-start items-start gap-0.5">
                            <div className="self-stretch text-center justify-start text-[#101113] text-sm font-bold leading-tight">
                                Jumlah Pesanan
                            </div>
                        </div>
                        <div className="w-40 inline-flex flex-col justify-start items-start gap-0.5">
                            <div className="self-stretch text-center justify-start text-[#101113] text-sm font-bold leading-tight">
                                Dusun
                            </div>
                        </div>
                        <div className="w-40 inline-flex flex-col justify-start items-start gap-0.5">
                            <div className="self-stretch text-center justify-start text-[#101113] text-sm font-bold leading-tight">
                                Alamat Lengkap
                            </div>
                        </div>
                        <div className="w-40 inline-flex flex-col justify-start items-start gap-0.5">
                            <div className="self-stretch text-center justify-start text-[#101113] text-sm font-bold leading-tight">
                                Status Pengiriman
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Rows */}
                {orders.map((order) => (
                    <RowTable
                        key={order.id}
                        customerName={order.customerName}
                        itemCount={order.itemCount}
                        location={order.location}
                        address={order.address}
                        status={order.status}
                        showColumn5={true}
                        showColumn6={false}
                        showActions={false}
                        showLeadingCheckbox={false}
                    />
                ))}
            </>
        );
    };

    return (
        <div className="w-[1127px] h-auto min-h-[744px] relative">
            {/* Background Container */}
            <div className="w-full h-full absolute bg-gradient-to-b from-[#4d53d2] to-[#272b6c] rounded-[20px]"></div>

            {/* Table Content */}
            <div className="relative p-[27px] flex flex-col space-y-2">
                {renderContent()}
            </div>
        </div>
    );
}