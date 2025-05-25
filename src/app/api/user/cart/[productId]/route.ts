import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(req: NextRequest, { params }: { params: { productId: string } }) {
    const { productId } = params;

    try {
        const cartCookie = (await cookies()).get('cart')?.value;

        if (!cartCookie) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 404 });
        }

        const cartItems = JSON.parse(cartCookie);

        // Find and remove the item
        const updatedCart = cartItems.filter((item: { productId: number; }) => item.productId !== parseInt(productId));

        if (cartItems.length === updatedCart.length) {
            return NextResponse.json({ error: 'Product not found in cart' }, { status: 404 });
        }

        // Update cookie
        (await
            // Update cookie
            cookies()).set('cart', JSON.stringify(updatedCart), {
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: '/',
            });

        return NextResponse.json({
            message: `Removed product ${productId} from cart`,
            cart: updatedCart
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to remove from cart',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}