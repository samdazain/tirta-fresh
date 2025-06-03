import React from 'react';

interface SuccessModalProps {
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="w-[456px] bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border-2 border-green-600 p-8 flex flex-col items-center justify-between gap-6">
                <div className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <div className="text-center text-black text-2xl font-semibold">
                    Pesanan Anda telah berhasil dikirim!
                </div>

                <div className="text-center text-gray-600">
                    Terima kasih telah berbelanja di Tirta Fresh. Kami akan segera memproses pesanan Anda.
                </div>

                <button
                    onClick={onClose}
                    className="w-64 h-12 bg-green-600 rounded-[10px] text-white text-xl font-bold cursor-pointer hover:bg-green-700 transition-colors duration-200"
                >
                    Kembali ke Beranda
                </button>
            </div>
        </div>
    );
};

export default SuccessModal;
