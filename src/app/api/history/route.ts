import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Calculate the date range for last two days (today and yesterday)
        const now = new Date();
        const twoDaysAgo = new Date(now);
        twoDaysAgo.setDate(now.getDate() - 2);
        twoDaysAgo.setHours(0, 0, 0, 0);

        const orders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: twoDaysAgo
                }
            },
            include: {
                village: true,
                payment: true,
                invoice: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform orders to match the expected frontend format
        const transformedOrders = orders.map(order => {
            // Censor customer name (show first 3 chars + **, last 3 chars + **)
            const censoredName = order.customerName.length > 6
                ? `${order.customerName.substring(0, 3)}** ${order.customerName.substring(order.customerName.length - 3)}******`
                : `${order.customerName.substring(0, 2)}** ******`;

            // Calculate item count from JSON items
            let itemCount = 0;
            if (Array.isArray(order.items)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                itemCount = order.items.reduce((total: number, item: any) => {
                    return total + (item.quantity || 0);
                }, 0);
            }

            return {
                id: order.id,
                customerName: censoredName,
                itemCount: `${itemCount} Item`,
                location: order.village.name,
                address: order.fullAddress,
                status: order.status,
                createdAt: order.createdAt.toISOString()
            };
        });

        return NextResponse.json(transformedOrders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({
            error: 'Failed to fetch order history',
            details: errorMessage
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}