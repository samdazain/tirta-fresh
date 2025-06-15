import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                village: true,
                invoice: true,
                payment: true
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Invoice not found' },
                { status: 404 }
            );
        }

        // Transform order to invoice format
        const invoice = {
            id: order.invoice?.id || order.id,
            orderId: order.id,
            customerName: order.customerName,
            customerAddress: order.fullAddress,
            village: order.village.name,
            items: order.items,
            amount: order.invoice?.total || 0,
            status: order.status === 'SELESAI' ? 'paid' : 'pending',
            dateCreated: order.createdAt.toISOString(),
            datePaid: order.status === 'SELESAI' ? order.updatedAt.toISOString() : null,
            invoiceNumber: `INV-${String(order.id).padStart(6, '0')}`
        };

        return NextResponse.json({ invoice });

    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoice' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
