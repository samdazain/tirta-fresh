import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const timeframe = searchParams.get('timeframe') || 'all';

        // Build date filter based on timeframe
        let dateFilter = {};
        const now = new Date();

        switch (timeframe) {
            case 'today':
                const startOfDay = new Date(now.setHours(0, 0, 0, 0));
                const endOfDay = new Date(now.setHours(23, 59, 59, 999));
                dateFilter = {
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay
                    }
                };
                break;
            case 'week':
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
                startOfWeek.setHours(0, 0, 0, 0);
                dateFilter = {
                    createdAt: {
                        gte: startOfWeek
                    }
                };
                break;
            case 'month':
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter = {
                    createdAt: {
                        gte: startOfMonth
                    }
                };
                break;
            default:
                // 'all' - no date filter
                break;
        }

        // Fetch orders with status 'SELESAI' that have invoices
        const orders = await prisma.order.findMany({
            where: {
                status: 'SELESAI',
                ...dateFilter
            },
            include: {
                village: true,
                invoice: true,
                payment: true
            },
            orderBy: { createdAt: 'desc' }
        });

        // Transform orders to invoice format
        const invoices = orders.map(order => ({
            id: order.invoice?.id || order.id,
            orderId: order.id,
            customerName: order.customerName,
            customerAddress: order.fullAddress,
            village: order.village.name,
            items: order.items,
            amount: order.invoice?.total || 0,
            status: 'paid' as const, // Orders with status 'SELESAI' are considered paid
            dateCreated: order.createdAt.toISOString(),
            datePaid: order.updatedAt.toISOString(),
            invoiceNumber: `INV-${String(order.id).padStart(6, '0')}`
        }));

        return NextResponse.json({ invoices });

    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invoices' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
