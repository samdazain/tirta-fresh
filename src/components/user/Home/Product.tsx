import React, { JSX } from 'react';
import Image, { StaticImageData } from 'next/image';

interface ProductProps {
    name: string;
    image: StaticImageData;
    price?: string;
    onClick?: () => void;
}

export default function Product({ name, image, price, onClick }: ProductProps): JSX.Element {
    return (
        <div
            className="w-[280px] flex flex-col items-center cursor-pointer hover:opacity-95 transition-opacity"
            onClick={onClick}
        >
            {/* Product Image Container */}
            <div className="w-[240px] h-[240px] relative mb-4 flex items-center justify-center">
                <Image
                    src={image}
                    alt={name}
                    width={220}
                    height={220}
                    className="object-contain max-h-[220px]"
                    priority={false}
                />
            </div>

            {/* Price Display */}
            {price && (
                <div className="w-full text-center text-lg text-gray-700 mb-1">
                    {price}
                </div>
            )}

            {/* Product Name */}
            <div className="w-full text-center text-black text-2xl font-normal">
                {name}
            </div>
        </div>
    );
}