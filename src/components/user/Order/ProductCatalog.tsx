import React, { useState } from 'react';
import ProductCatalogCard from './ProductCatalogCard';
import { StaticImageData } from 'next/image';

// Import galon product images
import leGalon from '@/public/assets/product/galon/le_galon.png';
import cleoGalon from '@/public/assets/product/galon/cleo_galon.png';
import clubGalon from '@/public/assets/product/galon/club_galon.png';
import aquaGalon from '@/public/assets/product/galon/aqua_galon.png';

// Import botol product images
import leBotol15 from '@/public/assets/product/botol/le_botol_1.5.png';
import leBotol330 from '@/public/assets/product/botol/le_botol_330.png';
import leBotol600 from '@/public/assets/product/botol/le_botol_600.png';
import aquaBotol15 from '@/public/assets/product/botol/aqua_botol_1.5.png';
import aquaBotol330 from '@/public/assets/product/botol/aqua_botol_330.png';
import aquaBotol600 from '@/public/assets/product/botol/aqua_botol_600.png';
import questo600 from '@/public/assets/product/botol/aquesto_600_botol.png';
import questo300 from '@/public/assets/product/botol/aquesto_botol_300.png';
import cleoBotol550 from '@/public/assets/product/botol/cleo_botol_550.png';
import clubBotol15 from '@/public/assets/product/botol/club_botol_1.5.png';
import clubBotol600 from '@/public/assets/product/botol/club_botol_600.png';

// Import gelas product images
import aquestoGelas from '@/public/assets/product/gelas/aquesto_gelas.png';
import cleoGelas from '@/public/assets/product/gelas/cleo_gelas.png';
import cleoGelasCepuk from '@/public/assets/product/gelas/cleo_gelas_cepuk.png';
import clubGelas from '@/public/assets/product/gelas/club_gelas.png';
import clubGelasCepuk from '@/public/assets/product/gelas/club_gelas_cepuk.png';
import aquaGelas from '@/public/assets/product/gelas/aqua_gelas.png';

// Import produk lain images
import lpg from '@/public/assets/product/produk_lain/lpg.png';
import tehPucuk from '@/public/assets/product/produk_lain/teh_pucuk.png';
interface Product {
    id: number;
    name: string;
    image: StaticImageData;
    price: string;
    isAvailable?: boolean;
}


// Products data organized by category with StaticImageData
const productsData = {
    galon: [
        {
            id: 1,
            name: "Le Minerale",
            image: leGalon,
            price: "Rp 20.000",
            isAvailable: true,
        },
        {
            id: 2,
            name: "Cleo",
            image: cleoGalon,
            price: "Rp 21.000",
            isAvailable: true,
        },
        {
            id: 3,
            name: "Club",
            image: clubGalon,
            price: "Rp 22.000",
            isAvailable: true,
        },
        {
            id: 4,
            name: "Aqua",
            image: aquaGalon,
            price: "Rp 23.000",
            isAvailable: false,
        },
    ],
    botol: [
        {
            id: 5,
            name: "Le Minerale 1.5L",
            image: leBotol15,
            price: "Rp 6.000",
            isAvailable: true,
        },
        {
            id: 6,
            name: "Le Minerale 600ml",
            image: leBotol600,
            price: "Rp 4.000",
            isAvailable: true,
        },
        {
            id: 7,
            name: "Le Minerale 330ml",
            image: leBotol330,
            price: "Rp 3.000",
            isAvailable: true,
        },
        {
            id: 8,
            name: "Aqua 1.5L",
            image: aquaBotol15,
            price: "Rp 6.500",
            isAvailable: true,
        },
        {
            id: 9,
            name: "Aqua 600ml",
            image: aquaBotol600,
            price: "Rp 4.500",
            isAvailable: true,
        },
        {
            id: 10,
            name: "Aqua 330ml",
            image: aquaBotol330,
            price: "Rp 3.500",
            isAvailable: true,
        },
        {
            id: 11,
            name: "Questo 600ml",
            image: questo600,
            price: "Rp 4.000",
            isAvailable: true,
        },
        {
            id: 12,
            name: "Questo 300ml",
            image: questo300,
            price: "Rp 3.000",
            isAvailable: true,
        },
        {
            id: 13,
            name: "Cleo 550ml",
            image: cleoBotol550,
            price: "Rp 4.500",
            isAvailable: true,
        },
        {
            id: 14,
            name: "Club 1.5L",
            image: clubBotol15,
            price: "Rp 6.000",
            isAvailable: true,
        },
        {
            id: 15,
            name: "Club 600ml",
            image: clubBotol600,
            price: "Rp 4.000",
            isAvailable: true,
        },
    ],
    gelas: [
        {
            id: 16,
            name: "Aquesto",
            image: aquestoGelas,
            price: "Rp 20.000/dus",
            isAvailable: true,
        },
        {
            id: 17,
            name: "Cleo",
            image: cleoGelas,
            price: "Rp 21.000/dus",
            isAvailable: true,
        },
        {
            id: 18,
            name: "Cleo Cepuk",
            image: cleoGelasCepuk,
            price: "Rp 22.000/dus",
            isAvailable: true,
        },
        {
            id: 19,
            name: "Club",
            image: clubGelas,
            price: "Rp 19.000/dus",
            isAvailable: true,
        },
        {
            id: 20,
            name: "Club Cepuk",
            image: clubGelasCepuk,
            price: "Rp 20.000/dus",
            isAvailable: true,
        },
        {
            id: 21,
            name: "Aqua",
            image: aquaGelas,
            price: "Rp 22.000/dus",
            isAvailable: true,
        },
    ],
    produk_lain: [
        {
            id: 22,
            name: "LPG 12kg",
            image: lpg,
            price: "Rp 180.000",
            isAvailable: true,
        },
        {
            id: 23,
            name: "Teh Pucuk",
            image: tehPucuk,
            price: "Rp 5.000",
            isAvailable: true,
        },
    ],
};

interface ProductCatalogProps {
    onAddToCart: (product: Product) => void;
}

const ProductCatalog: React.FC<ProductCatalogProps> = ({ onAddToCart }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>("galon");
    const categories = ["galon", "botol", "gelas", "produk_lain"];
    const categoryTitles = {
        galon: "Air Mineral Galon",
        botol: "Air Mineral Botol",
        gelas: "Air Mineral Gelas",
        produk_lain: "Produk Lainnya"
    };

    const filteredProducts = productsData[selectedCategory as keyof typeof productsData] || [];

    return (
        <div className="w-full max-w-[800px] relative">
            <h1 className="text-indigo-600 text-3xl font-bold mb-6">Order</h1>

            {/* Category Selection */}
            <div className="w-full max-w-[320px] bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] mb-6 overflow-hidden">
                {categories.map((category, index) => (
                    <div
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full h-12 flex items-center justify-center cursor-pointer transition-colors duration-200
                            ${selectedCategory === category
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-700 text-white hover:bg-slate-600'}
                            ${index !== 0 ? 'border-t border-gray-600/30' : ''}
                        `}
                    >
                        <div className="text-center text-xl font-medium">
                            {categoryTitles[category as keyof typeof categoryTitles]}
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Title */}
            <div className="w-full mb-8 relative">
                <div className="w-64 h-12 bg-gradient-to-r from-indigo-600 to-slate-700 rounded-[10px] flex items-center shadow-md">
                    <div className="ml-5 text-white text-2xl font-bold">
                        {categoryTitles[selectedCategory as keyof typeof categoryTitles]}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6">
                {filteredProducts.map(product => (
                    <ProductCatalogCard
                        key={product.id}
                        id={product.id}
                        name={product.name}
                        image={product.image}
                        price={product.price}
                        isAvailable={product.isAvailable !== false}
                        onAddToCart={() => onAddToCart(product)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog;