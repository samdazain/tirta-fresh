import React, { JSX } from "react";
import Image from "next/image";
import logo from "@/public/assets/logo.png";
import Link from "next/link";

export default function Footer(): JSX.Element {
    return (
        <footer className="w-full bg-gradient-to-r from-[#303564] to-[#4d53d2] pt-10">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Logo and Company Info */}
                    <div className="flex flex-1 mb-8 md:mb-0">
                        <div className="mr-6">
                            <Image
                                src={logo}
                                alt="Logo"
                                width={71}
                                height={85}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex flex-col">
                            <h2 className="text-white text-4xl md:text-5xl font-medium mb-4">
                                Tirta Fresh
                            </h2>
                            <p className="text-white text-base font-medium max-w-md">
                                Agen Galon Le Minerale Tirta Fresh
                                <br />
                                C749+QXF, Kalianyar, Jogoroto, Kec. Jogoroto, Kabupaten Jombang,
                                Jawa Timur
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Navigation Links */}
                    <div className="flex flex-row justify-between md:justify-end space-x-10 md:space-x-16">
                        {/* First Nav Column */}
                        <ul className="text-white list-disc list-inside space-y-3">
                            <li>
                                <Link href="/" className="text-white text-xl font-medium hover:text-gray-200 transition pl-1">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-white text-xl font-medium hover:text-gray-200 transition pl-1">
                                    Daftar Produk
                                </Link>
                            </li>
                            <li>
                                <Link href="/order" className="text-white text-xl font-medium hover:text-gray-200 transition pl-1">
                                    Pesan Antar
                                </Link>
                            </li>
                            <li>
                                <Link href="/#address" className="text-white text-xl font-medium hover:text-gray-200 transition pl-1">
                                    Alamat Toko
                                </Link>
                            </li>
                        </ul>

                        {/* Second Nav Column */}
                        <ul className="text-white list-disc list-inside space-y-3">
                            <li>
                                <Link href="/products" className="text-white text-xl font-medium hover:text-gray-200 transition pl-1">
                                    Produk
                                </Link>
                            </li>
                            <li>
                                <Link href="/order" className="text-white text-xl font-medium hover:text-gray-200 transition pl-1">
                                    Order
                                </Link>
                            </li>
                            <li>
                                <Link href="/history" className="text-white text-xl font-medium hover:text-gray-200 transition pl-1">
                                    Riwayat
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 text-center pb-6">
                    <p className="text-white text-base font-medium">
                        Tirta Fresh &copy;2025 All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};