import React from 'react';
import Image from 'next/image';
import { PlusIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
    id: number;
    name: string;
    imageUrl: string;
    price: string;
    isAvailable: boolean;
    onAddToCart: (productId: number) => void;
}

const ProductCatalogCard: React.FC<ProductCardProps> = ({
    id,
    name,
    imageUrl,
    price,
    isAvailable,
    onAddToCart
}) => {
    return (
        <div className="w-72 h-96 relative transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-default">
            <div className="w-72 h-96 left-0 top-0 absolute bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] transition-shadow duration-200 hover:shadow-xl" />

            {/* Product image */}
            <div className="w-72 h-72 top-[17px] absolute flex items-center justify-center">
                <Image
                    src={imageUrl || '/images/products/default.jpg'}
                    alt={name}
                    width={280}
                    height={280}
                    className="object-contain max-h-full max-w-full"
                    priority={false}
                />
            </div>

            {/* Product name - Fixed overflow with proper text wrapping */}
            <div className="w-52 left-[40px] top-[300px] absolute text-center text-black text-lg font-normal font-['Poppins'] leading-tight overflow-hidden">
                <div className="line-clamp-2 break-words px-2">
                    {name}
                </div>
            </div>

            {/* Price, availability status, and add to cart button in one horizontal row */}
            <div className="w-60 h-8 left-[25px] top-[353px] absolute flex items-center justify-center gap-2 pb-4">
                <div className="flex items-center">
                    <span className="text-black text-base font-normal font-['Poppins'] pr-2">{price} | </span>
                    {isAvailable ? (
                        <span className="text-green-600 text-base font-bold font-['Poppins']">Tersedia</span>
                    ) : (
                        <span className="text-neutral-500 text-base font-bold font-['Poppins']">Kosong</span>
                    )}
                    <span className="text-black text-base font-normal font-['Poppins'] pl-2">|</span>
                </div>

                {/* Add to cart button */}
                <button
                    onClick={() => isAvailable && onAddToCart(id)}
                    className={`w-9 h-7 rounded-[10px] flex items-center justify-center transition-all duration-200 ${isAvailable
                        ? 'bg-green-500 hover:bg-green-600 cursor-pointer transform hover:scale-110 active:scale-95 shadow-md hover:shadow-lg'
                        : 'bg-stone-400 cursor-not-allowed opacity-60'
                        }`}
                    disabled={!isAvailable}
                    title={isAvailable ? "Tambah ke keranjang" : "Stok habis"}
                >
                    <PlusIcon className="w-4 h-4 text-white" />
                </button>
            </div>
        </div>
    );
};

export default ProductCatalogCard;