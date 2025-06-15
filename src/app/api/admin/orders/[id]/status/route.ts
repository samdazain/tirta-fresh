import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);
        const { status } = await request.json();

        if (!status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses: OrderStatus[] = ['SELESAI', 'DALAM_PENGIRIMAN', 'DITANGGUHKAN'];
        if (!validStatuses.includes(status as OrderStatus)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            // Get the current order to check previous status
            const currentOrder = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    village: true,
                    payment: true,
                    invoice: true
                }
            });

            if (!currentOrder) {
                throw new Error('Order not found');
            }

            const previousStatus = currentOrder.status;
            const newStatus = status as OrderStatus;

            // Handle stock restoration logic
            if (previousStatus !== 'DITANGGUHKAN' && newStatus === 'DITANGGUHKAN') {
                // Order is being cancelled/suspended - restore stock
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items = currentOrder.items as any[];

                for (const item of items) {
                    const product = await tx.product.findUnique({
                        where: { id: item.id }
                    });

                    if (product) {
                        await tx.product.update({
                            where: { id: item.id },
                            data: {
                                stock: product.stock + item.quantity
                            }
                        });
                    }
                }
            } else if (previousStatus === 'DITANGGUHKAN' && newStatus !== 'DITANGGUHKAN') {
                // Order is being reactivated from suspended state - decrease stock again
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items = currentOrder.items as any[];

                for (const item of items) {
                    const product = await tx.product.findUnique({
                        where: { id: item.id }
                    });

                    if (!product) {
                        throw new Error(`Product with ID ${item.id} not found`);
                    }

                    if (product.stock < item.quantity) {
                        throw new Error(`Insufficient stock to reactivate order. Product: ${product.name}, Available: ${product.stock}, Required: ${item.quantity}`);
                    }

                    await tx.product.update({
                        where: { id: item.id },
                        data: {
                            stock: product.stock - item.quantity
                        }
                    });
                }
            }
            // If status changes from 'DALAM_PENGIRIMAN' to 'SELESAI', no stock change needed
            // Stock was already decreased when order was placed

            // Update the order status
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: { status: newStatus },
                include: {
                    village: true,
                    payment: true,
                    invoice: true
                }
            });

            return updatedOrder;
        });

        return NextResponse.json({
            success: true,
            message: `Order status updated to ${status}${status === 'DITANGGUHKAN' ? ' and stock restored' : status === 'SELESAI' ? ' and completed' : ''}`,
            order: {
                id: result.id,
                customerName: result.customerName,
                fullAddress: result.fullAddress,
                village: result.village.name,
                items: result.items,
                total: result.invoice?.total || 0,
                status: result.status,
                paymentProof: result.payment ? `/api/admin/orders/${result.id}/payment-proof` : null,
                createdAt: result.createdAt.toISOString(),
                updatedAt: result.updatedAt.toISOString()
            }
        });

    } catch (error) {
        console.error('Error updating order status:', error);

        // Return specific error messages for stock issues
        if (error instanceof Error) {
            if (error.message.includes('Insufficient stock') || error.message.includes('not found')) {
                return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Failed to update order status' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
