'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
}

interface ProductModalProps {
    product?: Product;
    onClose: () => void;
    onSave: (product: Omit<Product, 'id'>) => Promise<void>;
    isNew: boolean;
    loading?: boolean;
}

const CATEGORY_OPTIONS = [
    { value: 'GALON', label: 'Galon' },
    { value: 'BOTOL', label: 'Botol' },
    { value: 'GELAS', label: 'Gelas' },
    { value: 'LAINNYA', label: 'Lainnya' },
] as const;

export default function ProductModal({
    product,
    onClose,
    onSave,
    isNew,
    loading = false
}: ProductModalProps) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        category: product?.category || 'GALON',
        stock: product?.stock || '',
        imageUrl: product?.imageUrl || ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nama produk wajib diisi';
        }

        const priceNum = typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price;
        if (!priceNum || priceNum <= 0) {
            newErrors.price = 'Harga harus lebih dari 0';
        }

        const stockNum = typeof formData.stock === 'string' ? parseInt(formData.stock) : formData.stock;
        if (stockNum < 0 || isNaN(stockNum)) {
            newErrors.stock = 'Stok tidak boleh negatif';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (imageUrl: string) => {
        setFormData(prev => ({
            ...prev,
            imageUrl
        }));
    };

    const handleImageRemove = () => {
        setFormData(prev => ({
            ...prev,
            imageUrl: ''
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            // Convert string values to numbers for submission
            const dataToSave = {
                ...formData,
                price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
                stock: typeof formData.stock === 'string' ? parseInt(formData.stock) : formData.stock,
                imageUrl: formData.imageUrl || '/images/products/default.jpg'
            };
            await onSave(dataToSave);
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">
                        {isNew ? 'Tambah Produk Baru' : 'Edit Produk'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Section */}
                        <ImageUpload
                            currentImage={formData.imageUrl}
                            onImageChange={handleImageChange}
                            onImageRemove={handleImageRemove}
                            disabled={loading}
                        />

                        {/* Product Details */}
                        <div className="grid grid-cols-1 gap-6">
                            {/* Product Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Produk *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    placeholder="Masukkan nama produk"
                                    disabled={loading}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                                )}
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                        Harga (Rp) *
                                    </label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        min="0"
                                        step="1"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="0"
                                        disabled={loading}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                        Stok *
                                    </label>
                                    <input
                                        type="number"
                                        id="stock"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        min="0"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.stock ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="0"
                                        disabled={loading}
                                    />
                                    {errors.stock && (
                                        <p className="text-red-500 text-xs mt-1">{errors.stock}</p>
                                    )}
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Kategori *
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={loading}
                                >
                                    {CATEGORY_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 cursor-pointer hover:shadow-md"
                                disabled={loading}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all duration-200 cursor-pointer hover:shadow-md transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:transform-none"
                                disabled={loading}
                            >
                                {loading ? 'Menyimpan...' : (isNew ? 'Buat Produk' : 'Simpan Perubahan')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}