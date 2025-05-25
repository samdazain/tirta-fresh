import { NextRequest, NextResponse } from 'next/server';

// Using the same in-memory store as in the main orders route
// In a real application, this would be fetched from a database
const orders = [
    {
        id: 101,
        customerName: 'John Doe',
        items: [
            { id: 1, name: 'Gallon 19L', price: 25000, quantity: 2 },
            { id: 3, name: 'Small Bottle (330ml)', price: 3000, quantity: 5 },
        ],
        total: 65000,
        address: '123 Main St, Jakarta',
        paymentProof: '/uploads/payments/101.jpg',
        status: 'pending',
        createdAt: '2023-11-20T10:23:15Z',
        updatedAt: '2023-11-20T10:23:15Z',
    },
    // Other orders...
];

// GET payment proof for an order
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const orderId = parseInt(params.id, 10);

    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.paymentProof) {
        return NextResponse.json({ error: 'Payment proof not found' }, { status: 404 });
    }

    // In a real application, you might want to handle file access differently
    return NextResponse.json({ paymentProof: order.paymentProof }, { status: 200 });
}

// PATCH order status (accept/reject payment)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = parseInt(params.id, 10);
        const body = await request.json();
        const { action } = body;

        const orderIndex = orders.findIndex(o => o.id === orderId);

        if (orderIndex === -1) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        let newStatus;

        // Update status based on action
        if (action === 'accept') {
            newStatus = 'processing';
        } else if (action === 'reject') {
            newStatus = 'payment_rejected';
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Update the order
        orders[orderIndex] = {
            ...orders[orderIndex],
            status: newStatus,
            updatedAt: new Date().toISOString()
        };

        return NextResponse.json({
            message: `Payment ${action === 'accept' ? 'accepted' : 'rejected'} successfully`,
            order: orders[orderIndex]
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating payment status:', error);
        return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    }
}
