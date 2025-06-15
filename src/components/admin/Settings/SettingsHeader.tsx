'use client';

import { PlusIcon, RefreshCcwIcon } from 'lucide-react';

interface SettingsHeaderProps {
    onAddUser: () => void;
    onRefresh: () => void;
    loading?: boolean;
    userCount: number;
}

export default function SettingsHeader({
    onAddUser,
    onRefresh,
    loading = false,
    userCount
}: SettingsHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pengaturan Sistem</h1>
                <p className="text-gray-600">
                    Kelola admin users dan pengaturan sistem
                </p>
                <div className="mt-2">
                    <span className="text-sm text-gray-500">
                        {userCount} admin user terdaftar
                    </span>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onRefresh}
                    disabled={loading}
                    className="flex items-center px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    title="Refresh Data"
                >
                    <RefreshCcwIcon size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
                <button
                    onClick={onAddUser}
                    className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                    <PlusIcon size={16} className="mr-2" />
                    Tambah Admin
                </button>
            </div>
        </div>
    );
}
