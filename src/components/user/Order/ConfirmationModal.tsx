import React from 'react';

interface ConfirmationModalProps {
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="w-[456px] h-80 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-indigo-600 p-8 flex flex-col items-center justify-between">
                <div className="text-center text-black text-2xl font-semibold">
                    Apakah anda yakin sudah menyelesaikan pembayaran?
                </div>

                <div className="text-center text-red-700 text-xs">
                    *Jika pembayaran belum dibayar/tidak sesuai maka anda harus bersedia jika pesanan Anda ditangguhkan
                </div>

                <div className="flex gap-6">
                    <button
                        onClick={onConfirm}
                        className="w-44 h-20 bg-green-600 rounded-[10px] text-white text-2xl font-bold"
                    >
                        Ya, Sudah
                    </button>

                    <button
                        onClick={onCancel}
                        className="w-44 h-20 bg-red-600 rounded-[10px] text-white text-2xl font-bold"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;