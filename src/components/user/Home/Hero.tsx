import React, { JSX } from "react";
import Image from "next/image";
import hero from "@/public/assets/images/hero.png";
import Link from "next/link";

export default function Hero(): JSX.Element {
    return (
        <div className="w-[1130px] h-64 relative">
            <Image
                src={hero}
                alt="Hero Image"
                width={648}
                height={263}
                className="w-[648.17px] h-64 left-0 top-0 absolute rounded-[20px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
            />
            <div className="left-[675px] top-0 absolute justify-start bg-gradient-to-r from-[rgba(77,84,210,1)] to-[rgba(55,142,242,1)] bg-clip-text text-transparent text-3xl font-bold font-['Poppins']">
                Depot Air Minum Tirta Fresh
            </div>
            <div className="w-[453px] left-[675px] top-[48px] absolute justify-start text-black text-2xl font-light font-['Poppins']">
                Menjual berbagai produk air minum kemasan. Melayani pesan antar daerah Dusun Kalianyar Jatirogo, Jombang. Ayo pesan sekarang!
            </div>

            {/* Button with proper text alignment */}
            <Link href="/order">
                <div className="w-64 h-16 left-[672px] top-[201px] absolute bg-gradient-to-r from-[#14a4ff] to-[#4d53d2] rounded-[20px] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                    <span className="text-white text-3xl font-normal">Order</span>
                </div>
            </Link>
        </div>
    );
}