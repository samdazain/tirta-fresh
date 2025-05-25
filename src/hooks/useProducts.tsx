'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
    stock: number;
    imageUrl: string;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/products');

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Fetch error response:', errorText);
                throw new Error(`Failed to fetch products: ${response.status}`);
            }

            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const createProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
        try {
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Create error response:', errorText);

                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || 'Failed to create product');
                } catch {
                    throw new Error(`Failed to create product: ${response.status}`);
                }
            }

            const data = await response.json();
            setProducts(prev => [...prev, data.product]);
            return data.product;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }, []);

    const updateProduct = useCallback(async (id: number, productData: Omit<Product, 'id'>) => {
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Update error response:', errorText);
                console.error('Update URL:', `/api/admin/products/${id}`);
                console.error('Update data:', productData);

                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || 'Failed to update product');
                } catch {
                    throw new Error(`Failed to update product: ${response.status}`);
                }
            }

            const data = await response.json();
            setProducts(prev => prev.map(p => p.id === id ? data.product : p));
            return data.product;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }, []);

    const deleteProduct = useCallback(async (id: number) => {
        try {
            const response = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Delete error response:', errorText);

                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || 'Failed to delete product');
                } catch {
                    throw new Error(`Failed to delete product: ${response.status}`);
                }
            }

            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        products,
        loading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        refetch: fetchProducts,
    };
}

export function useProductFilters(products: Product[]) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, categoryFilter]);

    return {
        searchTerm,
        categoryFilter,
        filteredProducts,
        setSearchTerm,
        setCategoryFilter,
    };
}