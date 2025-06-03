interface DeleteConfirmModalProps {
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
    loading?: boolean;
}

export default function DeleteConfirmModal({
    onClose,
    onConfirm,
    productName,
    loading = false
}: DeleteConfirmModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 w-full max-w-md shadow-2xl">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Hapus Produk</h2>
                <p className="mb-6 text-gray-600">
                    Apakah Anda yakin ingin menghapus produk{' '}
                    <span className="font-semibold">&quot;{productName}&quot;</span>? Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 cursor-pointer hover:shadow-md"
                        disabled={loading}
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400 transition-all duration-200 cursor-pointer hover:shadow-md transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none"
                        disabled={loading}
                    >
                        {loading ? 'Menghapus...' : 'Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
}