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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Confirm Delete</h2>
                <p className="mb-6 text-gray-600">
                    Are you sure you want to delete the product{' '}
                    <span className="font-semibold">&quot;{productName}&quot;</span>?
                    This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-red-400 transition-colors"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}