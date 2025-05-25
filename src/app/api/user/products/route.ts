import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProductCategory } from '@prisma/client';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        if (!category) {
            return NextResponse.json({ error: 'Category required' }, { status: 400 });
        }

        // Map category names to enum values
        const categoryMap: Record<string, ProductCategory> = {
            'galon': ProductCategory.GALON,
            'botol': ProductCategory.BOTOL,
            'gelas': ProductCategory.GELAS,
            'produk_lain': ProductCategory.LAINNYA,
        };

        const mappedCategory = categoryMap[category];
        if (!mappedCategory) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: { category: mappedCategory },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}