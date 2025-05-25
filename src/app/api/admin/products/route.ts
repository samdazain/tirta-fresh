import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProductCategory } from '@prisma/client';

// GET all products
export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const category = url.searchParams.get('category');

        let products;
        if (category && Object.values(ProductCategory).includes(category as ProductCategory)) {
            products = await prisma.product.findMany({
                where: { category: category as ProductCategory },
                orderBy: { createdAt: 'desc' }
            });
        } else {
            products = await prisma.product.findMany({
                orderBy: { createdAt: 'desc' }
            });
        }

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST new product
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, price, stock, imageUrl, category } = body;

        // Validation
        if (!name || price === undefined || stock === undefined || !category) {
            return NextResponse.json({
                error: 'Name, price, stock, and category are required'
            }, { status: 400 });
        }

        // Map category names to enum values if needed
        const categoryMap: Record<string, ProductCategory> = {
            'gallon': ProductCategory.GALON,
            'bottle': ProductCategory.BOTOL,
            'glass': ProductCategory.GELAS,
            'other': ProductCategory.LAINNYA,
        };

        let mappedCategory = category;
        if (typeof category === 'string' && !Object.values(ProductCategory).includes(category as ProductCategory)) {
            mappedCategory = categoryMap[category] || ProductCategory.LAINNYA;
        }

        const newProduct = await prisma.product.create({
            data: {
                name: name.trim(),
                price: parseInt(price.toString()),
                stock: parseInt(stock.toString()),
                imageUrl: imageUrl || '/images/products/default.jpg',
                category: mappedCategory,
            }
        });

        return NextResponse.json({
            message: 'Product created successfully',
            product: newProduct
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({
            error: 'Failed to create product'
        }, { status: 500 });
    }
}