import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// GET cart contents
export async function GET() {
    const cartCookie = (await cookies()).get('cart')?.value;

    if (!cartCookie) {
        return NextResponse.json({ items: [] });
    }

    try {
        const cartItems = JSON.parse(cartCookie);

        // Fetch product details for items in cart
        if (cartItems.length > 0) {
            const productIds = cartItems.map((item: { productId: number; }) => item.productId);
            const products = await prisma.product.findMany({
                where: { id: { in: productIds } }
            });

            // Merge product details with cart quantities
            const enrichedCart = cartItems.map((item: { productId: number; quantity: number; }) => {
                const product = products.find(p => p.id === item.productId);
                return {
                    ...product,
                    quantity: item.quantity
                };
            });

            return NextResponse.json({ items: enrichedCart });
        }

        return NextResponse.json({ items: [] });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch cart',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

// Add to cart
export async function POST(req: Request) {
    const body = await req.json();
    const { productId, quantity } = body;

    if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json({
            error: 'productId and a positive quantity are required'
        }, { status: 400 });
    }

    try {
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Get existing cart from cookies
        const cartCookie = (await cookies()).get('cart')?.value;
        const cartItems = cartCookie ? JSON.parse(cartCookie) : [];

        // Check if product already in cart
        const existingItemIndex = cartItems.findIndex((item: { productId: number; }) => item.productId === productId);

        if (existingItemIndex >= 0) {
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            cartItems.push({ productId, quantity });
        }

        // Update cookie
        (await
            // Update cookie
            cookies()).set('cart', JSON.stringify(cartItems), {
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

        return NextResponse.json({
            message: 'Product added to cart',
            cart: cartItems
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to add to cart',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}