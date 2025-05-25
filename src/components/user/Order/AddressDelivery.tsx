import React, { useState } from 'react';
import Dropdown from './Dropdown';

interface AddressDeliveryProps {
    onAddressChange: (address: AddressInfo) => void;
}

export interface AddressInfo {
    location: string;
    fullAddress: string;
    customerName: string;
}

const AddressDelivery: React.FC<AddressDeliveryProps> = ({ onAddressChange }) => {
    const locations = [
        "Dusun Kalianyar",
        "Dusun Sumberpenganten",
        "Desa Jogoroto",
        "Desa Janti",
        "Desa Ngumpul",
        "Desa Sawiji",
        "Desa Sumbermulyo",
        "Desa Tanggungan",
        "Desa Rejoagung"
    ];

    const [addressInfo, setAddressInfo] = useState<AddressInfo>({
        location: locations[0],
        fullAddress: "",
        customerName: ""
    });

    const handleInputChange = (field: keyof AddressInfo, value: string) => {
        const updatedInfo = { ...addressInfo, [field]: value };
        setAddressInfo(updatedInfo);
        onAddressChange(updatedInfo);
    };

    return (
        <div className="w-[479px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="w-full bg-gradient-to-b from-sky-500 to-indigo-600 rounded-[10px] p-6">
                <div className="text-white text-3xl font-bold mb-6">
                    Alamat Pengantaran
                </div>

                <Dropdown
                    label="Desa/Dusun"
                    options={locations}
                    value={addressInfo.location}
                    onChange={(value) => handleInputChange('location', value)}
                />

                <div className="mt-6">
                    <div className="text-white text-xl font-medium mb-2">
                        Alamat Lengkap
                    </div>
                    <input
                        type="text"
                        value={addressInfo.fullAddress}
                        onChange={(e) => handleInputChange('fullAddress', e.target.value)}
                        placeholder="Jalan Merpati No.20"
                        className="w-full h-14 px-4 bg-zinc-300 rounded-[10px] text-black text-xl font-medium"
                    />
                </div>

                <div className="mt-6">
                    <div className="text-white text-xl font-medium mb-2">
                        Nama Pemesan
                    </div>
                    <input
                        type="text"
                        value={addressInfo.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Nama Lengkap"
                        className="w-full h-14 px-4 bg-zinc-300 rounded-[10px] text-black text-xl font-medium"
                    />
                </div>

                {addressInfo.location && addressInfo.fullAddress && (
                    <div className="text-white text-base mt-6">
                        Diantar ke <span className="font-bold">{addressInfo.location}, {addressInfo.fullAddress}</span>
                        {addressInfo.customerName && (
                            <span> atas nama <span className="font-bold">{addressInfo.customerName}</span></span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddressDelivery;