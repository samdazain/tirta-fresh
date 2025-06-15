import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
    startOfDay, endOfDay, subDays,
    startOfWeek, endOfWeek, subWeeks,
    startOfMonth, endOfMonth, subMonths,
    startOfQuarter, endOfQuarter, subQuarters,
    startOfYear, endOfYear,
    format, getQuarter
} from 'date-fns';
import { id } from 'date-fns/locale';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'daily';
        const periods = parseInt(url.searchParams.get('periods') || '7');
        const year = parseInt(url.searchParams.get('year') || new Date().getFullYear().toString());

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

            switch (type) {
                case 'daily':
                    const targetDate = subDays(currentDate, i);
                    startDate = startOfDay(targetDate);
                    endDate = endOfDay(targetDate);
                    label = format(targetDate, 'dd MMM yyyy', { locale: id });
                    break;

                case 'weekly':
                    const weekDate = subWeeks(currentDate, i);
                    startDate = startOfWeek(weekDate, { weekStartsOn: 1 });
                    endDate = endOfWeek(weekDate, { weekStartsOn: 1 });
                    label = `Minggu ${format(startDate, 'dd MMM', { locale: id })} - ${format(endDate, 'dd MMM yyyy', { locale: id })}`;
                    break;

                case 'monthly':
                    const monthDate = subMonths(currentDate, i);
                    startDate = startOfMonth(monthDate);
                    endDate = endOfMonth(monthDate);
                    label = format(monthDate, 'MMMM yyyy', { locale: id });
                    break;

                case 'quarterly':
                    const quarterDate = subQuarters(currentDate, i);
                    startDate = startOfQuarter(quarterDate);
                    endDate = endOfQuarter(quarterDate);
                    const quarter = getQuarter(quarterDate);
                    label = `Q${quarter} ${format(quarterDate, 'yyyy')}`;
                    break;

                case 'yearly':
                    const yearDate = new Date(year - i, 0, 1);
                    startDate = startOfYear(yearDate);
                    endDate = endOfYear(yearDate);
                    label = format(yearDate, 'yyyy');
                    break;

                default:
                    throw new Error('Invalid report type');
            }

            // Fetch orders with SELESAI status
            const orders = await prisma.order.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate
                    },
                    status: 'SELESAI'
                },
                include: {
                    invoice: true,
                    village: true
                }
            });

            // Calculate period metrics
            let periodRevenue = 0;
            let periodItems = 0;
            const itemBreakdown: Record<string, { quantity: number; revenue: number; category: string }> = {};

            orders.forEach(order => {
                // Get total from invoice
                if (order.invoice) {
                    periodRevenue += order.invoice.total;
                }

                // Parse JSON items
                try {
                    const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items as string);
                    if (Array.isArray(items)) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        items.forEach((item: any) => {
                            const quantity = parseInt(item.quantity) || 0;
                            const price = parseInt(item.price) || 0;
                            const name = item.name || 'Unknown Product';

                            periodItems += quantity;

                            if (!itemBreakdown[name]) {
                                itemBreakdown[name] = {
                                    quantity: 0,
                                    revenue: 0,
                                    category: item.category || 'General'
                                };
                            }

                            itemBreakdown[name].quantity += quantity;
                            itemBreakdown[name].revenue += price * quantity;
                        });
                    }
                } catch (e) {
                    console.warn('Could not parse order items:', e);
                }
            });

            reports.push({
                period: label,
                dateRange: {
                    start: startDate.toISOString(),
                    end: endDate.toISOString()
                },
                totalRevenue: periodRevenue,
                totalItems: periodItems,
                totalOrders: orders.length,
                itemBreakdown: Object.entries(itemBreakdown).map(([name, data]) => ({
                    name,
                    ...data
                })).sort((a, b) => b.revenue - a.revenue)
            });

            totalRevenue += periodRevenue;
            totalItems += periodItems;
            totalOrders += orders.length;
        }

        // Get overall product sales for the entire period
        const allItemBreakdown: Record<string, { quantity: number; revenue: number; category: string }> = {};

        reports.forEach(report => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            report.itemBreakdown.forEach((item: any) => {
                if (!allItemBreakdown[item.name]) {
                    allItemBreakdown[item.name] = {
                        quantity: 0,
                        revenue: 0,
                        category: item.category
                    };
                }
                allItemBreakdown[item.name].quantity += item.quantity;
                allItemBreakdown[item.name].revenue += item.revenue;
            });
        });

        const productSales = Object.entries(allItemBreakdown).map(([name, data]) => ({
            name,
            ...data
        })).sort((a, b) => b.revenue - a.revenue);

        return NextResponse.json({
            reportType: type,
            period: type === 'yearly' ? `${year}` : `Last ${periods} ${type}`,
            reports: reports.reverse(),
            summary: {
                totalRevenue,
                totalItems,
                totalOrders,
                averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
                periodsAnalyzed: periods
            },
            productSales,
            metadata: {
                generatedAt: new Date().toISOString(),
                currency: 'IDR',
                timezone: 'Asia/Jakarta'
            }
        }, { status: 200 });

    } catch (error) {
        console.error('Error generating reports:', error);
        return NextResponse.json({
            error: 'Failed to generate reports',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}