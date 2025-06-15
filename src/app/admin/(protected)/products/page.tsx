'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import ProductModal from '@/components/admin/Products/ProductModal';
import DeleteConfirmModal from '@/components/admin/Products/DeleteConfirmModal';
import ProductTable from '@/components/admin/Products/ProductTable';
import ProductFilters from '@/components/admin/Products/ProductFilters';
import { useProducts, useProductFilters } from '@/hooks/useProducts';
import { useToast } from '@/contexts/ToastContext';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
}

export default function ProductsPage() {
    const searchParams = useSearchParams();


    const {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct
    } = useProducts();

    const {
        searchTerm,
        categoryFilter,
        filteredProducts,
        setSearchTerm,
        setCategoryFilter,
    } = useProductFilters(products);

    const { showSuccess, showError } = useToast();

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<Product | undefined>(undefined);
    const [isNewProduct, setIsNewProduct] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    // Delete modal states
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Modal handlers
    const handleAddProduct = useCallback(() => {
        setCurrentProduct(undefined);
        setIsNewProduct(true);
        setShowModal(true);
    }, []);

    const handleEditProduct = useCallback((product: Product) => {
        setCurrentProduct(product);
        setIsNewProduct(false);
        setShowModal(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setCurrentProduct(undefined);
        setModalLoading(false);
    }, []);

    const handleSaveProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
        setModalLoading(true);
        try {
            if (isNewProduct) {
                await createProduct(productData);
                showSuccess(`Product "${productData.name}" has been created successfully!`);
            } else if (currentProduct) {
                await updateProduct(currentProduct.id, productData);
                showSuccess(`Product "${productData.name}" has been updated successfully!`);
            }
            handleCloseModal();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            showError(isNewProduct ? 'Failed to create product' : 'Failed to update product');
            console.error(errorMessage);
        } finally {
            setModalLoading(false);
        }
    }, [isNewProduct, currentProduct, createProduct, updateProduct, handleCloseModal, showSuccess, showError]);

    // Delete handlers
    const handleDeleteClick = useCallback((product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    }, []);

    const handleCloseDeleteModal = useCallback(() => {
        setShowDeleteModal(false);
        setProductToDelete(null);
        setDeleteLoading(false);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!productToDelete) return;

        setDeleteLoading(true);
        try {
            await deleteProduct(productToDelete.id);
            showSuccess(`Product "${productToDelete.name}" has been deleted successfully!`);
            handleCloseDeleteModal();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
            showError(errorMessage);
        } finally {
            setDeleteLoading(false);
        }
    }, [productToDelete, deleteProduct, handleCloseDeleteModal, showSuccess, showError]);

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'add') {
            handleAddProduct();
        }
    }, [searchParams, handleAddProduct]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Produk</h1>
                    <p className="text-gray-600">Kelola inventori produk Anda</p>
                </div>
                <button
                    onClick={handleAddProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                >
                    <Plus size={20} />
                    <span>Tambah Produk</span>
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            {/* Filters */}
            <ProductFilters
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategoryFilter}
            />

            {/* Products Table */}
            <ProductTable
                products={filteredProducts}
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
                loading={loading}
            />

            {/* Product Modal */}
            {showModal && (
                <ProductModal
                    product={currentProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveProduct}
                    isNew={isNewProduct}
                    loading={modalLoading}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && productToDelete && (
                <DeleteConfirmModal
                    onClose={handleCloseDeleteModal}
                    onConfirm={handleConfirmDelete}
                    productName={productToDelete.name}
                    loading={deleteLoading}
                />
            )}
        </div>
    );
}