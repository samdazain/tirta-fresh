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

        const payment = await prisma.payment.findUnique({
            where: { orderId: orderId }
        });

        if (!payment) {
            return NextResponse.json(
                { error: 'Payment proof not found' },
                { status: 404 }
            );
        }

        return new NextResponse(Buffer.from(payment.blobData), {
            headers: {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'public, max-age=31536000'
            }
        });

    } catch (error) {
        console.error('Error fetching payment proof:', error);
        return NextResponse.json(
            { error: 'Failed to fetch payment proof' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
