import React, { useState, useRef, useEffect } from 'react';
import ProductCatalogCard from './ProductCatalogCard';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    imageUrl: string;
    category: string;
}

interface ProductCatalogProps {
    onAddToCart: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("GALON");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const categories = ["GALON", "BOTOL", "GELAS", "LAINNYA"];
    const categoryTitles = {
        GALON: "Air Mineral Galon",
        BOTOL: "Air Mineral Botol",
        GELAS: "Air Mineral Gelas",
        LAINNYA: "Produk Lainnya"
    };

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/products?category=${selectedCategory}`);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.products);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCategorySelect = (category: string) => {
        setSelectedCategory(category);
        setIsDropdownOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="w-full max-w-[800px] relative">
            <h1 className="text-indigo-600 text-3xl font-bold mb-6">Order</h1>

            {/* Category Title with Dropdown */}
            <div className="w-[600px] mb-8 relative" ref={dropdownRef}>
                <div className="w-80 h-11 relative">
                    <div className="w-80 h-11 left-0 top-0 absolute bg-gradient-to-r from-indigo-600 to-slate-700 rounded-[10px]" />
                    <div className="w-64 left-[21.68px] top-[4px] absolute justify-start text-white text-2xl font-bold font-['Poppins']">
                        {categoryTitles[selectedCategory as keyof typeof categoryTitles]}
                    </div>

                    {/* Dropdown Toggle Button */}
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onKeyDown={handleKeyDown}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded cursor-pointer hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 hover:scale-110"
                        aria-label="Select category"
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="listbox"
                    >
                        <ChevronDownIcon
                            className={`w-5 h-5 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                }`}
                        />
                    </button>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                    <div className="absolute top-12 left-0 w-80 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] overflow-hidden z-10">
                        <ul role="listbox" className="py-1">
                            {categories.map((category, index) => (
                                <li key={category} role="option" aria-selected={selectedCategory === category}>
                                    <button
                                        onClick={() => handleCategorySelect(category)}
                                        className={`w-full h-12 px-6 text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 cursor-pointer
                                            ${selectedCategory === category
                                                ? 'bg-indigo-600 text-white transform scale-[1.02]'
                                                : 'text-slate-700 hover:bg-gray-50 hover:transform hover:scale-[1.01]'}
                                            ${index !== 0 ? 'border-t border-gray-200' : ''}
                                        `}
                                    >
                                        <div className="text-xl font-medium">
                                            {categoryTitles[category as keyof typeof categoryTitles]}
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 justify-items-center gap-6">
                {loading ? (
                    <div className="col-span-2 flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                        <p className="text-gray-500 text-lg">Tidak ada produk dalam kategori ini</p>
                    </div>
                ) : (
                    products.map(product => (
                        <ProductCatalogCard
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            imageUrl={product.imageUrl}
                            price={`Rp ${product.price.toLocaleString()}`}
                            isAvailable={product.stock > 0}
                            onAddToCart={() => onAddToCart(product)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;