'use client';

import React, { useState } from 'react';
import ProductCatalog from '@/components/user/Order/ProductCatalog';
import AddressDelivery, { AddressInfo } from '@/components/user/Order/AddressDelivery';
import Billing from '@/components/user/Order/Billing';
import SuccessModal from '@/components/user/Order/SuccessModal';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    price: string;
}

interface CartItem {
    id: number;
    name: string;
    price: string;
    quantity: number;
}

export default function Order() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [addressInfo, setAddressInfo] = useState<AddressInfo>({
        location: '',
        fullAddress: '',
        customerName: ''
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleAddToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                // Update quantity if item already in cart
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item to cart
                return [...prevCart, {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                }];
            }
        });
    };

    const handleCheckout = () => {
        // In a real application, you would send the order to your backend
        console.log('Order submitted:', {
            items: cart,
            address: addressInfo,
            total: calculateTotal()
        });

        // Show success modal instead of alert
        setShowSuccessModal(true);
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((total, item) => {
            const price = parseInt(item.price.replace(/\D/g, ''));
            return total + (price * item.quantity);
        }, 0);

        return subtotal + 5000; // Adding 5000 for shipping
    };

    return (
        <main className="min-h-screen py-12 bg-white">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-center gap-6">
                {/* Product Catalog */}
                <div>
                    <ProductCatalog onAddToCart={handleAddToCart} />
                </div>

                {/* Address and Billing */}
                <div className="space-y-8">
                    <AddressDelivery onAddressChange={setAddressInfo} />
                    <Billing cartItems={cart} onCheckout={handleCheckout} />
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal onClose={() => {
                    setShowSuccessModal(false);
                    router.push('/');
                }} />
            )}
        </main>
    );
}