'use client'

import React from "react";
import Hero from "@/components/user/Home/Hero";
import ListProduct from "@/components/user/Home/ListProduct";
import DeliveryTerms from "@/components/user/Home/DeliveryTerms";
import dynamic from 'next/dynamic';

const Maps = dynamic(() => import('@/components/user/Home/Address'), {
    ssr: false,
});

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center bg-white">

            <div className="mt-8 mb-16">
                <Hero />
            </div>

            {/* Products List Section */}
            <div className="mb-16">
                <h2 className="text-[32px] font-bold text-[#4d53d2] mb-12 text-center">
                    Produk Kami
                </h2>
                <ListProduct title="Air Mineral Galon" category="GALON" />
                <ListProduct title="Air Mineral Botol" category="BOTOL" />
                <ListProduct title="Air Mineral Gelas" category="GELAS" />
                <ListProduct title="Produk Lainnya" category="LAINNYA" />
            </div>

            <div className="mb-16 bg-gradient-to-r p-10 rounded-[20px] w-[1039px]">
                <DeliveryTerms />
            </div>

            <div className="mb-16">
                <Maps />
            </div>
        </main>
    );
}