import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const orderId = formData.get('orderId') as string;
        const paymentProof = formData.get('paymentProof') as File;

        if (!orderId || !paymentProof) {
            return NextResponse.json({
                error: 'orderId and paymentProof are required'
            }, { status: 400 });
        }

        // Check if order exists
        const order = await prisma.order.findUnique({
            where: { id: parseInt(orderId) }
        });

        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Convert file to buffer
        const buffer = await paymentProof.arrayBuffer();
        const blobData = Buffer.from(buffer);

        // Create payment record
        const payment = await prisma.payment.create({
            data: {
                blobData,
                order: {
                    connect: { id: parseInt(orderId) }
                }
            }
        });

        return NextResponse.json({
            message: 'Payment proof submitted',
            paymentId: payment.id
        });
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to submit payment proof',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}