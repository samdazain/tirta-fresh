import React, { useState } from 'react';
import ConfirmationModal from './ConfirmationModal';

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface BillingProps {
    cartItems: CartItem[];
    onCheckout: (paymentProofFile: File) => void;
    isSubmitting?: boolean;
}

const Billing: React.FC<BillingProps> = ({ cartItems, onCheckout, isSubmitting = false }) => {
    const [showModal, setShowModal] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    };

    const shippingCost = 5000;
    const subtotal = calculateSubtotal();
    const total = subtotal + shippingCost;

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString('id-ID')}`;
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setReceiptFile(files[0]);
            setUploadSuccess(true);
        } else {
            setReceiptFile(null);
            setUploadSuccess(false);
        }
    };

    const handleConfirmationYes = () => {
        if (receiptFile) {
            onCheckout(receiptFile);
        }
        setShowModal(false);
    };

    return (
        <div className="w-[479px] bg-gradient-to-b from-blue-500 to-indigo-600 rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-6">
            <div className="text-white text-3xl font-bold mb-8">
                Pembayaran
            </div>

            {/* Cart Items */}
            <div className="space-y-4 mb-8">
                {cartItems.length === 0 ? (
                    <div className="bg-white rounded-[10px] p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                        <div className="text-center text-black text-xl font-light">
                            Belum ada produk dipilih
                        </div>
                    </div>
                ) : (
                    cartItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-[10px] p-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                            <div className="text-black text-2xl font-normal">
                                {item.name}
                            </div>
                            <div className="text-black text-2xl font-light">
                                {formatPrice(item.price)} x {item.quantity}
                            </div>
                            <div className="text-black text-2xl font-light">
                                Total : {formatPrice(item.price * item.quantity)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Account Information */}
            <div className="text-white text-xl font-bold mb-6">
                Rek. BCA Ferdi<br />0123123123
            </div>

            {/* Totals */}
            <div className="text-white text-xl font-bold mb-2">
                Ongkir : {formatPrice(shippingCost)}
            </div>
            <div className="text-white text-3xl font-bold mb-8">
                Total Bayar : {formatPrice(total)}
            </div>

            {/* Upload Payment Receipt */}
            <div className="flex items-center mb-6">
                <label className="w-96 h-14 bg-indigo-900 rounded-[10px] flex items-center justify-center cursor-pointer hover:bg-indigo-800 transition-colors duration-200 transform hover:scale-[1.02]">
                    <span className="text-white text-xl font-medium truncate px-4">
                        {receiptFile ? receiptFile.name : "Upload Bukti Bayar"}
                    </span>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={isSubmitting}
                    />
                </label>

                {/* Check File Was Uploaded Indicator*/}
                <div className={`w-16 h-14 rounded-[10px] ml-3 flex items-center justify-center transition-all duration-300 ${uploadSuccess
                    ? 'bg-green-500 text-white shadow-md transform scale-105'
                    : 'bg-zinc-300 text-zinc-500'
                    }`}>
                    {uploadSuccess && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={() => setShowModal(true)}
                disabled={cartItems.length === 0 || !receiptFile || isSubmitting}
                className={`w-108 h-14 rounded-[10px] flex items-center justify-center transition-all duration-200 ${cartItems.length > 0 && receiptFile && !isSubmitting
                    ? 'bg-green-500 hover:bg-green-600 cursor-pointer transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
                    : 'bg-gray-400 cursor-not-allowed opacity-60'
                    }`}
            >
                <span className="text-white text-xl font-semibold">
                    {isSubmitting ? 'Memproses...' : 'Selesai Bayar'}
                </span>
            </button>

            {/* Confirmation Modal */}
            {showModal && (
                <ConfirmationModal
                    onConfirm={handleConfirmationYes}
                    onCancel={() => setShowModal(false)}
                />
            )}
        </div>
    );
};

export default Billing;