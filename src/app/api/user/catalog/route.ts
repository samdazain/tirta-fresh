import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const catalog = await prisma.product.findMany({
            orderBy: { name: 'asc' }
        });

        // Group products by category
        const groupedCatalog = catalog.reduce<Record<string, typeof catalog>>((acc, product) => {
            const category = product.category;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(product);
            return acc;
        }, {});

        return NextResponse.json(groupedCatalog);
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to fetch catalog',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
