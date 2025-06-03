import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        let whereClause = {};
        if (status && status !== 'all') {
            whereClause = { status: status };
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                village: true,
                payment: true,
                invoice: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform orders to match expected format
        const transformedOrders = orders.map(order => ({
            id: order.id,
            customerName: order.customerName,
            fullAddress: order.fullAddress,
            village: order.village.name,
            items: order.items,
            total: order.invoice?.total || 0,
            status: order.status,
            paymentProof: order.payment ? `/api/admin/orders/${order.id}/payment-proof` : null,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.updatedAt.toISOString()
        }));

        return NextResponse.json({ orders: transformedOrders });

    } catch (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: 'Failed to fetch orders' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
