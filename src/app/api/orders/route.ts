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

        // Create order with payment and stock management in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // First, check stock availability and calculate total
            let total = 0;
            const stockUpdates = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.id }
                });

                if (!product) {
                    throw new Error(`Product with ID ${item.id} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`);
                }

                total += product.price * item.quantity;
                stockUpdates.push({
                    productId: product.id,
                    quantity: item.quantity,
                    newStock: product.stock - item.quantity
                });
            }

            total += 5000; // shipping cost

            // Update stock for all products
            for (const update of stockUpdates) {
                await tx.product.update({
                    where: { id: update.productId },
                    data: { stock: update.newStock }
                });
            }

            // Create the order
            const order = await tx.order.create({
                data: {
                    customerName,
                    fullAddress,
                    villageId,
                    items: items,
                    status: 'DALAM_PENGIRIMAN'
                }
            });

            // Create payment record
            const payment = await tx.payment.create({
                data: {
                    blobData: paymentProofBlob,
                    orderId: order.id
                }
            });

            // Create invoice
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
            orderId: result.order.id,
            message: 'Order created successfully and stock updated'
        });

    } catch (error) {
        console.error('Error creating order:', error);

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
            { error: 'Failed to create order' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
