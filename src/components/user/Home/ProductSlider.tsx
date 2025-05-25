'use client';

import React, { useState, useRef, useEffect, JSX } from 'react';
import Product from './Product';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ProductItem {
    id: number;
    name: string;
    imageUrl: string;
    price: string;
}

interface ProductSliderProps {
    products: ProductItem[];
    itemsToShow?: number;
}

export default function ProductSlider({ products, itemsToShow = 4 }: ProductSliderProps): JSX.Element {
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxIndex = Math.max(0, products.length - itemsToShow);
    const sliderRef = useRef<HTMLDivElement>(null);

    const nextSlide = () => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const prevSlide = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    useEffect(() => {
        if (sliderRef.current) {
            const scrollAmount = currentIndex * 295; // Width of product + gap
            sliderRef.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }, [currentIndex]);

    // Don't show navigation if all products fit
    const showNavigation = products.length > itemsToShow;

    return (
        <div className="w-full relative py-4">
            {/* Product Slider Container */}
            <div className="relative">
                {/* Left Navigation Button */}
                {showNavigation && (
                    <button
                        onClick={prevSlide}
                        disabled={currentIndex === 0}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white'
                            }`}
                        aria-label="Previous slide"
                    >
                        <FaChevronLeft size={24} className="text-[#4d53d2]" />
                    </button>
                )}

                {/* Slider Content */}
                <div
                    className="overflow-x-hidden relative mx-10"
                    ref={sliderRef}
                >
                    <div className="flex gap-5 transition-all duration-300 pb-4">
                        {products.map((product) => (
                            <div key={product.id} className="flex-shrink-0">
                                <Product
                                    name={product.name}
                                    imageUrl={product.imageUrl}
                                    price={product.price}
                                    onClick={() => console.log(`Selected product: ${product.name}`)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Navigation Button */}
                {showNavigation && (
                    <button
                        onClick={nextSlide}
                        disabled={currentIndex >= maxIndex}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md ${currentIndex >= maxIndex ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white'
                            }`}
                        aria-label="Next slide"
                    >
                        <FaChevronRight size={24} className="text-[#4d53d2]" />
                    </button>
                )}
            </div>
        </div>
    );
}