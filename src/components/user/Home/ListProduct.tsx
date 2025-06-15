'use client';

import React, { JSX, useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface DatabaseProduct {
    id: number;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: string;
}

interface ListProductProps {
    title: string;
    category: string;
}

export default function ListProduct({ title, category }: ListProductProps): JSX.Element {
    const [products, setProducts] = useState<DatabaseProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const productsPerPage = 4;

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/products?category=${category}`);
            const data = await response.json();

            if (response.ok) {
                setProducts(data.products || []);
            } else {
                console.error('Error fetching products:', data.error);
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const totalPages = Math.ceil(products.length / productsPerPage);
    const visibleProducts = products.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
    );

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    // Loading state
    if (loading) {
        return (
            <div className="w-[1130px] relative mb-20">
                <div className="w-auto h-11 inline-block px-5 bg-gradient-to-r from-[#4d53d2] to-[#303564] rounded-[10px]">
                    <div className="py-1 text-white text-2xl font-bold">
                        {title}
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="w-[280px] flex flex-col items-center animate-pulse">
                                <div className="w-[240px] h-[240px] bg-gray-200 rounded-lg mb-4"></div>
                                <div className="w-24 h-4 bg-gray-200 rounded mb-2"></div>
                                <div className="w-32 h-6 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Empty state
    if (products.length === 0) {
        return (
            <div className="w-[1130px] relative mb-20">
                <div className="w-auto h-11 inline-block px-5 bg-gradient-to-r from-[#4d53d2] to-[#303564] rounded-[10px]">
                    <div className="py-1 text-white text-2xl font-bold">
                        {title}
                    </div>
                </div>

                <div className="mt-8 text-center py-12">
                    <p className="text-gray-500 text-lg">Belum ada produk dalam kategori ini</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-[1130px] relative mb-20">
            {/* Title Background */}
            <div className="w-auto h-11 inline-block px-5 bg-gradient-to-r from-[#4d53d2] to-[#303564] rounded-[10px]">
                <div className="py-1 text-white text-2xl font-bold">
                    {title}
                </div>
            </div>

            {/* Products display with carousel navigation */}
            <div className="mt-8 relative">
                {/* Products grid */}
                <div className="flex gap-6">
                    {visibleProducts.map((product) => (
                        <div
                            key={product.id}
                            className="w-[280px] flex flex-col items-center cursor-pointer hover:opacity-95 transition-opacity"
                        >
                            {/* Product Image Container */}
                            <div className="w-[240px] h-[240px] relative mb-4 flex items-center justify-center">
                                <Image
                                    src={product.imageUrl || '/images/products/default.jpg'}
                                    alt={product.name}
                                    width={220}
                                    height={220}
                                    className="object-contain max-h-[220px]"
                                    priority={false}
                                />
                            </div>

                            {/* Price Display */}
                            <div className="w-full text-center text-lg text-gray-700 mb-1">
                                {formatCurrency(product.price)}
                            </div>

                            {/* Product Name */}
                            <div className="w-full text-center text-black text-2xl font-normal">
                                {product.name}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Carousel navigation (only shown if more than 4 products) */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 gap-4">
                        <button
                            onClick={prevPage}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                            aria-label="Previous page"
                        >
                            <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
                        </button>

                        <div className="text-sm text-gray-600">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <span
                                    key={idx}
                                    className={`inline-block size-2 mx-1 rounded-full cursor-pointer ${currentPage === idx ? 'bg-blue-600' : 'bg-gray-300'}`}
                                    role="button"
                                    onClick={() => setCurrentPage(idx)}
                                    aria-label={`Page ${idx + 1}`}
                                ></span>
                            ))}
                        </div>

                        <button
                            onClick={nextPage}
                            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none"
                            aria-label="Next page"
                        >
                            <ChevronRightIcon className="h-6 w-6 text-gray-700" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}