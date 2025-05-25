import React, { JSX } from "react";
import RowTable from "./RowTable";

// Mock data - replace with your actual data source
const historyData = [
    {
        id: 1,
        customerName: "Rif** And******",
        itemCount: "5 Item",
        location: "Kalianyar",
        address: "Jalan Merpati No. 20",
        status: "Dalam Pengiriman" as const
    },
    {
        id: 2,
        customerName: "Sam** Zai*****",
        itemCount: "20 Item",
        location: "Sumberpenganten",
        address: "Jalan Kuda No. 20",
        status: "Selesai" as const
    },
    {
        id: 3,
        customerName: "Fer** Muh*****",
        itemCount: "20 Item",
        location: "Sumberpenganten",
        address: "Jalan Kuda No. 20",
        status: "Ditangguhkan" as const
    }
];

export default function HistoryTable(): JSX.Element {
    return (
        <div className="w-[1127px] h-auto min-h-[744px] relative">
            {/* Background Container */}
            <div className="w-full h-full absolute bg-gradient-to-b from-[#4d53d2] to-[#272b6c] rounded-[20px]"></div>

            {/* Table Content */}
            <div className="relative p-[27px] flex flex-col space-y-2">
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
                {historyData.map((order) => (
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

                {/* You can add pagination or load more button here if needed */}
            </div>
        </div>
    );
}