import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = parseInt(params.id);
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: status as OrderStatus },
            include: {
                village: true,
                payment: true,
                invoice: true
            }
        });

        return NextResponse.json({
            success: true,
            order: {
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
            }
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
