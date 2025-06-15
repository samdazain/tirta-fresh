import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { startOfDay, startOfMonth, subMonths } from 'date-fns';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const now = new Date();
        const startOfToday = startOfDay(now);
        const startOfThisMonth = startOfMonth(now);
        const startOfLastMonth = startOfMonth(subMonths(now, 1));

        // Get total products
        const totalProducts = await prisma.product.count();

        // Get total orders
        const totalOrders = await prisma.order.count();

        // Get pending deliveries (orders with status DALAM_PENGIRIMAN)
        const pendingDeliveries = await prisma.order.count({
            where: { status: 'DALAM_PENGIRIMAN' }
        });

        // Get today's orders
        const todayOrders = await prisma.order.count({
            where: {
                createdAt: {
                    gte: startOfToday
                }
            }
        });

        // Get this month's revenue (from completed orders)
        const thisMonthOrders = await prisma.order.findMany({
            where: {
                status: 'SELESAI',
                createdAt: {
                    gte: startOfThisMonth
                }
            },
            include: { invoice: true }
        });

        const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => {
            return sum + (order.invoice?.total || 0);
        }, 0);

        // Get last month's revenue for comparison
        const lastMonthOrders = await prisma.order.findMany({
            where: {
                status: 'SELESAI',
                createdAt: {
                    gte: startOfLastMonth,
                    lt: startOfThisMonth
                }
            },
            include: { invoice: true }
        });

        const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => {
            return sum + (order.invoice?.total || 0);
        }, 0);

        // Calculate revenue trend
        const revenueTrend = lastMonthRevenue > 0
            ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
            : thisMonthRevenue > 0 ? 100 : 0;

        // Get recent orders (last 5)
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                village: true,
                invoice: true
            }
        });

        // Transform recent orders for frontend
        const transformedRecentOrders = recentOrders.map(order => {
            // Parse items from JSON
            let itemsText = 'Items tidak tersedia';
            try {
                const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string);
                if (Array.isArray(items) && items.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    itemsText = items.map((item: any) => `${item.name} x${item.quantity}`).join(', ');
                }
            } catch (e) {
                console.warn('Could not parse order items:', e);
            }

            return {
                id: order.id.toString(),
                customerName: order.customerName,
                items: itemsText,
                total: order.invoice?.total || 0,
                status: order.status.toLowerCase() as 'pending' | 'processing' | 'delivered' | 'cancelled',
                createdAt: order.createdAt.toISOString()
            };
        });

        // Low stock products (stock < 10)
        const lowStockProducts = await prisma.product.findMany({
            where: {
                stock: {
                    lt: 10
                }
            },
            select: {
                id: true,
                name: true,
                stock: true,
                category: true
            }
        });

        return NextResponse.json({
            stats: {
                totalProducts,
                totalOrders,
                pendingDeliveries,
                todayOrders,
                revenue: thisMonthRevenue,
                revenueTrend: Math.round(revenueTrend * 100) / 100
            },
            recentOrders: transformedRecentOrders,
            lowStockProducts,
            metadata: {
                generatedAt: new Date().toISOString(),
                currency: 'IDR'
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
