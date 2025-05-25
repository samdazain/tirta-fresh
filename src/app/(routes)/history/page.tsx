import React, { JSX } from "react";
import HistoryTable from "@/components/user/History/HistoryTable";
import DeliveryStatus from "@/components/user/History/DeliveryStatus";

export default function HistoryPage(): JSX.Element {
    return (
        <main className="min-h-screen flex flex-col items-center bg-white pb-16">
            <div className="container mx-auto px-4 flex flex-col items-center">
                {/* Page Title */}
                <h1 className="text-[32px] font-bold text-[#4d53d2] mt-8 mb-10">
                    Riwayat Pemesanan (19 Mei 2025)
                </h1>

                {/* History Table Section */}
                <div className="mb-16">
                    <HistoryTable />
                </div>

                {/* Delivery Status Section */}
                <div className="mb-16">
                    <DeliveryStatus />
                </div>
            </div>
        </main>
    );
}