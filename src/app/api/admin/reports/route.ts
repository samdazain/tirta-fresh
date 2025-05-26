import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from 'date-fns';

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'daily';
        const periods = parseInt(url.searchParams.get('periods') || '7');

        const currentDate = new Date();
        const reports = [];
        let totalRevenue = 0;
        let totalItems = 0;
        let totalOrders = 0;

        // Get data for specified periods based on type
        for (let i = 0; i < periods; i++) {
            let startDate: Date;
            let endDate: Date;
            let label: string;

            if (type === 'daily') {
                const targetDate = subDays(currentDate, i);
                startDate = startOfDay(targetDate);
                endDate = endOfDay(targetDate);
                label = format(targetDate, 'dd MMM yyyy');
            } else if (type === 'weekly') {
                const targetDate = subDays(currentDate, i * 7);
                startDate = startOfWeek(targetDate);
                endDate = endOfWeek(targetDate);
                label = `Week of ${format(startDate, 'dd MMM')}`;
            } else { // monthly
                const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                startDate = startOfMonth(targetDate);
                endDate = endOfMonth(targetDate);
                label = format(targetDate, 'MMM yyyy');
            }

            // Fix: Use correct status from schema and include invoice for total
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: 'SELESAI' // Fix: Use correct status from schema
                },
                include: {
                    invoice: true, // Fix: Get total from invoice
                    village: true
                }
            });

            // Calculate period metrics from JSON items and invoice
            let periodRevenue = 0;
            let periodItems = 0;

            orders.forEach(order => {
                // Get total from invoice if exists
                if (order.invoice) {
                    periodRevenue += order.invoice.total;
                }

                // Parse JSON items to count quantities
                try {
                    const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string);
                    if (Array.isArray(items)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        items.forEach((item: any) => {
                            if (item.quantity) {
                                periodItems += parseInt(item.quantity) || 0;
                            }
                        });
                    }
                } catch (e) {
                    console.warn('Could not parse order items:', e);
                }
            });

            reports.push({
                dateLabel: label,
                totalRevenue: periodRevenue,
                totalItems: periodItems,
                totalOrders: orders.length
            });

            totalRevenue += periodRevenue;
            totalItems += periodItems;
            totalOrders += orders.length;
        }

        // Get product sales for the entire period
        const startPeriod = type === 'daily' ? subDays(currentDate, periods) :
            type === 'weekly' ? subDays(currentDate, periods * 7) :
                new Date(currentDate.getFullYear(), currentDate.getMonth() - periods, 1);

        const allOrders = await prisma.order.findMany({
            where: {
                createdAt: {
                    gte: startPeriod,
                    lte: currentDate
                },
                status: 'SELESAI' // Fix: Use correct status
            },
            include: {
                invoice: true
            }
        });

        // Get all products to map IDs to names and categories
        const products = await prisma.product.findMany();
        const productMap = products.reduce((map, product) => {
            map[product.id] = {
                name: product.name,
                category: product.category,
                price: product.price
            };
            return map;
        }, {} as Record<number, { name: string; category: string; price: number }>);

        // Parse product sales from JSON items
        const productSalesMap: Record<string, { quantity: number; revenue: number; category: string }> = {};

        allOrders.forEach(order => {
            try {
                const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string);
                if (Array.isArray(items)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    items.forEach((item: any) => {
                        const productId = parseInt(item.productId || item.id);
                        const quantity = parseInt(item.quantity) || 0;
                        const price = parseInt(item.price) || 0;

                        if (productId && productMap[productId]) {
                            const product = productMap[productId];
                            const productName = product.name;

                            if (!productSalesMap[productName]) {
                                productSalesMap[productName] = {
                                    quantity: 0,
                                    revenue: 0,
                                    category: product.category
                                };
                            }

                            productSalesMap[productName].quantity += quantity;
                            productSalesMap[productName].revenue += price * quantity;
                        }
                    });
                }
            } catch (e) {
                console.warn('Could not parse order items for product sales:', e);
            }
        });

        const productSales = Object.entries(productSalesMap).map(([name, data]) => ({
            name,
            ...data
        })).sort((a, b) => b.revenue - a.revenue);

        return NextResponse.json({
            reports: reports.reverse(),
            summary: {
                totalRevenue,
                totalItems,
                totalOrders
            },
            productSales,
            period: `Last ${periods} ${type}`,
            generatedAt: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error('Error generating reports:', error);
        return NextResponse.json({
            error: 'Failed to generate reports',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}