import React, { useState, useEffect } from 'react';
import Dropdown from './Dropdown';

interface AddressDeliveryProps {
    onAddressChange: (address: AddressInfo) => void;
}

export interface AddressInfo {
    villageId: number;
    villageName: string;
    fullAddress: string;
    customerName: string;
}

interface Village {
    id: number;
    name: string;
}

const AddressDelivery: React.FC<AddressDeliveryProps> = ({ onAddressChange }) => {
    const [villages, setVillages] = useState<Village[]>([]);
    const [loading, setLoading] = useState(true);
    const [addressInfo, setAddressInfo] = useState<AddressInfo>({
        villageId: 0,
        villageName: "",
        fullAddress: "",
        customerName: ""
    });

    // Fetch villages from API
    useEffect(() => {
        const fetchVillages = async () => {
            try {
                const response = await fetch('/api/villages');
                if (response.ok) {
                    const data = await response.json();
                    setVillages(data.villages);
                    if (data.villages.length > 0) {
                        const firstVillage = data.villages[0];
                        setAddressInfo(prev => ({
                            ...prev,
                            villageId: firstVillage.id,
                            villageName: firstVillage.name
                        }));
                    }
                }
            } catch (error) {
                console.error('Error fetching villages:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchVillages();
    }, []);

    const handleInputChange = (field: keyof AddressInfo, value: string | number) => {
        const updatedInfo = { ...addressInfo, [field]: value };
        setAddressInfo(updatedInfo);
        onAddressChange(updatedInfo);
    };

    const handleVillageChange = (villageName: string) => {
        const selectedVillage = villages.find(v => v.name === villageName);
        if (selectedVillage) {
            const updatedInfo = {
                ...addressInfo,
                villageId: selectedVillage.id,
                villageName: selectedVillage.name
            };
            setAddressInfo(updatedInfo);
            onAddressChange(updatedInfo);
        }
    };

    if (loading) {
        return (
            <div className="w-[479px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <div className="w-full bg-gradient-to-b from-sky-500 to-indigo-600 rounded-[10px] p-6">
                    <div className="text-white text-3xl font-bold mb-6">
                        Alamat Pengantaran
                    </div>
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                        <p className="text-white mt-2">Memuat data desa...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[479px] relative shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
            <div className="w-full bg-gradient-to-b from-sky-500 to-indigo-600 rounded-[10px] p-6">
                <div className="text-white text-3xl font-bold mb-6">
                    Alamat Pengantaran
                </div>

                <Dropdown
                    label="Desa/Dusun"
                    options={villages.map(v => v.name)}
                    value={addressInfo.villageName}
                    onChange={handleVillageChange}
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

                {addressInfo.villageName && addressInfo.fullAddress && (
                    <div className="text-white text-base mt-6">
                        Diantar ke <span className="font-bold">{addressInfo.villageName}, {addressInfo.fullAddress}</span>
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