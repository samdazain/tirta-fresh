import React from 'react';
import Image, { StaticImageData } from 'next/image';
import { PlusIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
    id: number;
    name: string;
    image: StaticImageData;
    price: string;
    isAvailable: boolean;
    onAddToCart: (productId: number) => void;
}

const ProductCatalogCard: React.FC<ProductCardProps> = ({
    id,
    name,
    image,
    price,
    isAvailable,
    onAddToCart
}) => {
    return (
        <div className="w-[180px] sm:w-[200px] md:w-[220px] h-auto bg-white rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex flex-col items-center p-4">
            {/* Product name with fixed height and proper overflow handling */}
            <h3 className="w-full h-10 text-center text-black text-lg font-medium mb-2 flex items-center justify-center">
                <span className="line-clamp-2">{name}</span>
            </h3>

            {/* Fixed height image container */}
            <div className="w-full h-48 flex items-center justify-center">
                <Image
                    src={image}
                    alt={name}
                    width={150}
                    height={150}
                    className="object-contain max-h-full max-w-full"
                    priority={false}
                />
            </div>

            {/* Price and availability information */}
            <div className="w-full text-center mt-3 mb-2">
                <span className="text-black text-base font-normal">{price} | </span>
                {isAvailable ? (
                    <span className="text-green-600 text-base font-bold">Tersedia</span>
                ) : (
                    <span className="text-neutral-500 text-base font-bold">Kosong</span>
                )}
            </div>

            {/* Add to cart button */}
            <button
                onClick={() => isAvailable && onAddToCart(id)}
                className={`w-9 h-7 rounded-[10px] flex items-center justify-center ${isAvailable ? 'bg-green-500 hover:bg-green-600 transition-colors cursor-pointer' : 'bg-stone-400 cursor-not-allowed'}`}
                disabled={!isAvailable}
            >
                <PlusIcon className="w-4 h-4 text-white" />
            </button>
        </div>
    );
};

export default ProductCatalogCard;