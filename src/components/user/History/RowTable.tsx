import React, { JSX } from "react";
import { FaUser } from "react-icons/fa";

interface RowTableProps {
    customerName: string;
    itemCount: string;
    location: string;
    address: string;
    status: "Ditangguhkan" | "Selesai" | "Dalam Pengiriman";
    showActions?: boolean;
    showColumn5?: boolean;
    showColumn6?: boolean;
    showLeadingCheckbox?: boolean;
}

export default function RowTable({
    customerName,
    itemCount,
    location,
    address,
    status,
    showActions = false,
    showColumn5 = true,
    showColumn6 = false,
    showLeadingCheckbox = false,
}: RowTableProps): JSX.Element {
    // Map status to appropriate color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Ditangguhkan":
                return "text-[#b51b1b]"; // Red
            case "Selesai":
                return "text-[#1bb54e]"; // Green
            case "Dalam Pengiriman":
                return "text-[#b7b108]"; // Yellow
            default:
                return "text-[#101113]"; // Default text color
        }
    };

    return (
        <div
            data-show-actions={showActions}
            data-show-column-5={showColumn5}
            data-show-column-6={showColumn6}
            data-show-leading-checkbox={showLeadingCheckbox}
            data-type="Content"
            className="w-[1073px] py-4 bg-white rounded-[10px] border-b border-black/20 inline-flex justify-start items-center gap-2 hover:bg-gray-50 transition-colors duration-200"
        >
            <div className="flex-1 flex justify-center items-center gap-8">
                {/* Customer Name Column */}
                <div
                    data-show-caption="false"
                    data-size="Medium"
                    className="w-40 flex justify-start items-center gap-2"
                >
                    {/* User Icon from React Icons */}
                    <div className="size-10 bg-[#ebfbfe] rounded-full flex items-center justify-center">
                        <FaUser className="text-[#0b87ac] text-lg" />
                    </div>
                    <div className="flex-1 inline-flex flex-col justify-center items-start gap-0.5">
                        <div className="justify-start text-[#101113] text-sm font-medium leading-tight">
                            {customerName}
                        </div>
                    </div>
                </div>

                {/* Item Count Column */}
                <div
                    data-alignment="Left"
                    data-show-caption="false"
                    data-show-icon="true"
                    className="w-40 flex justify-start items-start gap-2"
                >
                    <div className="flex-1 inline-flex flex-col justify-center items-center gap-0.5">
                        <div className="text-center justify-start text-[#101113] text-sm font-medium leading-tight">
                            {itemCount}
                        </div>
                    </div>
                </div>

                {/* Location Column */}
                <div
                    data-caption="Top"
                    className="w-40 inline-flex flex-col justify-start items-center gap-0.5"
                >
                    <div className="text-center justify-start text-[#101113] text-sm font-medium leading-tight">
                        {location}
                    </div>
                </div>

                {/* Address Column */}
                <div
                    data-caption="Top"
                    className="w-40 inline-flex flex-col justify-center items-center gap-0.5"
                >
                    <div className="text-center justify-start text-[#101113] text-sm font-medium leading-tight truncate" title={address}>
                        {address}
                    </div>
                </div>

                {/* Status Column */}
                {showColumn5 && (
                    <div
                        data-caption="Top"
                        className="w-40 inline-flex flex-col justify-center items-center gap-0.5"
                    >
                        <div className={`justify-start ${getStatusColor(status)} text-sm font-bold leading-tight`}>
                            {status}
                        </div>
                    </div>
                )}

                {/* Optional Column 6 */}
                {showColumn6 && (
                    <div
                        data-caption="Top"
                        className="w-40 inline-flex flex-col justify-center items-center gap-0.5"
                    >
                        <div className="text-center justify-start text-[#101113] text-sm font-medium leading-tight">
                            Additional Info
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}