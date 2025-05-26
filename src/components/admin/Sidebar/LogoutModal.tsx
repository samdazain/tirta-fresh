'use client';

import { useState } from 'react';
import {
    ExclamationTriangleIcon,
    ArrowRightStartOnRectangleIcon
} from '@heroicons/react/24/outline';

interface LogoutModalProps {
    isOpen: boolean;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    userName?: string;
}

export default function LogoutModal({
    isOpen,
    onConfirm,
    onCancel,
    userName
}: LogoutModalProps) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await onConfirm();
        } catch (error) {
            console.error('Logout error:', error);
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 pb-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Konfirmasi Logout
                            </h3>
                            <p className="text-sm text-gray-500">
                                Apakah Anda yakin ingin keluar?
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-4">
                    <p className="text-gray-600">
                        {userName ? (
                            <>
                                Hai <span className="font-medium">{userName}</span>,
                                Anda akan keluar dari admin panel.
                                Pastikan semua pekerjaan telah disimpan.
                            </>
                        ) : (
                            'Anda akan keluar dari admin panel. Pastikan semua pekerjaan telah disimpan.'
                        )}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 p-6 pt-2 border-t border-gray-100">
                    <button
                        onClick={onCancel}
                        disabled={isLoggingOut}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoggingOut}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {isLoggingOut ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Logging out...</span>
                            </>
                        ) : (
                            <>
                                <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
                                <span>Ya, Keluar</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}