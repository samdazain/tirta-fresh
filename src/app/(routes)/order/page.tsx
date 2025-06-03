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
    price: number;
    stock: number;
    imageUrl: string;
    category: string;
}

interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export default function Order() {
    const router = useRouter();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [addressInfo, setAddressInfo] = useState<AddressInfo>({
        villageId: 0,
        villageName: '',
        fullAddress: '',
        customerName: ''
    });
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleCheckout = async (paymentProofFile: File) => {
        if (!addressInfo.villageId || !addressInfo.fullAddress || !addressInfo.customerName) {
            alert('Mohon lengkapi semua informasi pengiriman');
            return;
        }

        if (cart.length === 0) {
            alert('Keranjang belanja kosong');
            return;
        }

        if (!paymentProofFile) {
            alert('Mohon upload bukti pembayaran');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('customerName', addressInfo.customerName);
            formData.append('fullAddress', addressInfo.fullAddress);
            formData.append('villageId', addressInfo.villageId.toString());
            formData.append('items', JSON.stringify(cart));
            formData.append('paymentProof', paymentProofFile);

            const response = await fetch('/api/orders', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Order created successfully:', data);
                setShowSuccessModal(true);
            } else {
                const errorData = await response.json();
                alert('Gagal membuat pesanan: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Terjadi kesalahan saat membuat pesanan');
        } finally {
            setIsSubmitting(false);
        }
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
                    <Billing
                        cartItems={cart}
                        onCheckout={handleCheckout}
                        isSubmitting={isSubmitting}
                    />
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