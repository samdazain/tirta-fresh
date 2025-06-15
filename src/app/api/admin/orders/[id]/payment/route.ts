import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

// GET payment proof for an order
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
                payment: true
            }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (!order.payment) {
            return NextResponse.json({ error: 'Payment proof not found' }, { status: 404 });
        }

        // Return the payment proof as a blob
        const headers = new Headers();
        headers.set('Content-Type', 'image/jpeg'); // Adjust based on your image format
        headers.set('Content-Length', order.payment.blobData.byteLength.toString());

        return new NextResponse(Buffer.from(order.payment.blobData), {
            status: 200,
            headers
        });

    } catch (error) {
        console.error('Error fetching payment proof:', error);
        return NextResponse.json({ error: 'Failed to fetch payment proof' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// PATCH order status (accept/reject payment)
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);
        const body = await request.json();
        const { action } = body;

        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id: orderId },
                include: {
                    village: true,
                    payment: true,
                    invoice: true
                }
            });

            if (!order) {
                throw new Error('Order not found');
            }

            let newStatus;

            // Update status based on action
            if (action === 'accept') {
                newStatus = OrderStatus.SELESAI;
            } else if (action === 'reject') {
                newStatus = OrderStatus.DITANGGUHKAN;

                // Restore stock when rejecting payment
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const items = order.items as any[];
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
            } else {
                throw new Error('Invalid action');
            }

            // Update the order
            const updatedOrder = await tx.order.update({
                where: { id: orderId },
                data: {
                    status: newStatus,
                    updatedAt: new Date()
                },
                include: {
                    village: true,
                    payment: true,
                    invoice: true
                }
            });

            return updatedOrder;
        });

        return NextResponse.json({
            message: `Payment ${action === 'accept' ? 'accepted' : 'rejected'} successfully`,
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
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating payment status:', error);

        if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
