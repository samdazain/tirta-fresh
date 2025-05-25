import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { customerName, fullAddress, villageId, items, totalAmount } = body;

    if (!customerName || !fullAddress || !villageId || !items || !totalAmount) {
        return NextResponse.json({
            error: 'customerName, fullAddress, villageId, items, and totalAmount are required'
        }, { status: 400 });
    }

    try {
        // Check if village exists
        const village = await prisma.village.findUnique({
            where: { id: villageId }
        });

        if (!village) {
            return NextResponse.json({ error: 'Village not found' }, { status: 404 });
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                customerName,
                fullAddress,
                villageId,
                items, // Store as JSON
                status: OrderStatus.DITANGGUHKAN,
                invoice: {
                    create: {
                        total: totalAmount
                    }
                }
            },
            include: {
                invoice: true,
                village: true
            }
        });

        return NextResponse.json({ message: 'Order submitted', order });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to submit order', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
