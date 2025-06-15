'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import SettingsHeader from '@/components/admin/Settings/SettingsHeader';
import AdminUsersTable from '@/components/admin/Settings/AdminUsersTable';
import AdminUserForm from '@/components/admin/Settings/AdminUserForm';
import DeleteConfirmationModal from '@/components/admin/Settings/DeleteConfirmationModal';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

interface AdminUserFormData {
    name: string;
    email: string;
    password: string;
}

export default function SettingsPage() {
    const { admin: currentAdmin } = useAdmin();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Modal states
    const [showUserForm, setShowUserForm] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');

            if (!response.ok) {
                throw new Error('Failed to fetch admin users');
            }

            const data = await response.json();
            setUsers(data.admins);
            setError(null);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError(err instanceof Error ? err.message : 'Failed to load admin users');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Auto-clear messages
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    const handleAddUser = () => {
        setEditingUser(null);
        setShowUserForm(true);
    };

    const handleEditUser = (user: AdminUser) => {
        setEditingUser(user);
        setShowUserForm(true);
    };

    const handleDeleteUser = (user: AdminUser) => {
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    const handleFormSubmit = async (formData: AdminUserFormData) => {
        try {
            setFormLoading(true);

            const url = editingUser
                ? `/api/admin/settings/${editingUser.id}`
                : '/api/admin/settings';

            const method = editingUser ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save admin user');
            }

            setSuccess(data.message);
            setShowUserForm(false);
            setEditingUser(null);
            await fetchUsers();
        } catch (err) {
            console.error('Error saving user:', err);
            setError(err instanceof Error ? err.message : 'Failed to save admin user');
            throw err; // Re-throw to prevent form from closing
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return;

        try {
            const response = await fetch(`/api/admin/settings/${deletingUser.id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete admin user');
            }

            setSuccess(data.message);
            setShowDeleteModal(false);
            setDeletingUser(null);
            await fetchUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete admin user');
            throw err;
        }
    };

    const handleRefresh = () => {
        fetchUsers();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <SettingsHeader
                onAddUser={handleAddUser}
                onRefresh={handleRefresh}
                loading={loading}
                userCount={users.length}
            />

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-600 cursor-pointer transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span>{success}</span>
                        <button
                            onClick={() => setSuccess(null)}
                            className="text-green-400 hover:text-green-600 cursor-pointer transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* Admin Users Section */}
            <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Admin Users</h2>
                            <p className="text-sm text-gray-600">
                                Kelola akun administrator yang memiliki akses ke sistem
                            </p>
                        </div>
                    </div>

                    <AdminUsersTable
                        users={users}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        loading={loading}
                        currentUserId={currentAdmin?.id}
                    />
                </div>
            </div>

            {/* Modals */}
            <AdminUserForm
                isOpen={showUserForm}
                onClose={() => {
                    setShowUserForm(false);
                    setEditingUser(null);
                }}
                onSubmit={handleFormSubmit}
                editingUser={editingUser}
                loading={formLoading}
            />

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletingUser(null);
                }}
                onConfirm={handleDeleteConfirm}
                user={deletingUser}
            />
        </div>
    );
}
