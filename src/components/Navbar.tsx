import React, { JSX } from "react";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import Link from "next/link";

export default function Navbar(): JSX.Element {
    return (
        <nav className="w-full flex justify-center py-4">
            <div className="w-[1130px] h-22 relative">
                {/* Navbar background with gradient */}
                <div className="w-full h-22 left-0 top-0 absolute bg-gradient-to-r from-[#14a4ff] to-[#4d53d2] rounded-[20px]" />

                {/* Container for logo and nav items with flexbox for alignment */}
                <div className="absolute inset-0 flex items-center justify-between px-6">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image
                            src={logo}
                            alt="Logo"
                            width={63}
                            height={75}
                            priority
                            className="w-16 h-[75px] object-contain"
                        />
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center justify-end gap-8 mr-6">
                        <Link href="/" className="text-white text-3xl font-normal hover:text-gray-200 transition">
                            Beranda
                        </Link>
                        <Link href="/order" className="text-white text-3xl font-normal hover:text-gray-200 transition">
                            Order
                        </Link>
                        <Link href="/history" className="text-white text-3xl font-normal hover:text-gray-200 transition">
                            Riwayat
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}