import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        const customerName = formData.get('customerName') as string;
        const fullAddress = formData.get('fullAddress') as string;
        const villageId = parseInt(formData.get('villageId') as string);
        const items = JSON.parse(formData.get('items') as string);
        const paymentProofFile = formData.get('paymentProof') as File;

        if (!customerName || !fullAddress || !villageId || !items || !paymentProofFile) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const paymentProofBuffer = await paymentProofFile.arrayBuffer();
        const paymentProofBlob = Buffer.from(paymentProofBuffer);

        // Create order with payment in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    customerName,
                    fullAddress,
                    villageId,
                    items: items,
                    status: 'DALAM_PENGIRIMAN'
                }
            });

            const payment = await tx.payment.create({
                data: {
                    blobData: paymentProofBlob,
                    orderId: order.id
                }
            });

            // Calculate total from items
            let total = 0;
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.id }
                });
                if (product) {
                    total += product.price * item.quantity;
                }
            }
            total += 5000; // shipping cost

            const invoice = await tx.invoice.create({
                data: {
                    total,
                    orderId: order.id
                }
            });

            return { order, payment, invoice };
        });

        return NextResponse.json({
            success: true,
            orderId: result.order.id
        });

    } catch (error) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: 'Failed to create order' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
