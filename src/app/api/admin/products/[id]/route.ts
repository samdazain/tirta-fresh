import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ProductCategory } from '@prisma/client';

// GET single product by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const orderId = parseInt(id);

        if (isNaN(orderId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: orderId },
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ product }, { status: 200 });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

// UPDATE product by ID
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        const body = await request.json();
        const { name, price, stock, imageUrl, category } = body;

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Validate required fields
        if (!name || price === undefined || stock === undefined || !category) {
            return NextResponse.json({
                error: 'Name, price, stock, and category are required'
            }, { status: 400 });
        }

        // Map category names to enum values
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

        // Update the product
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name: name.trim(),
                price: parseInt(price.toString()),
                stock: parseInt(stock.toString()),
                imageUrl: imageUrl || existingProduct.imageUrl || '/images/products/default.jpg',
                category: mappedCategory,
                updatedAt: new Date(),
            }
        });

        return NextResponse.json({
            message: 'Product updated successfully',
            product: updatedProduct
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({
            error: 'Failed to update product'
        }, { status: 500 });
    }
}

// DELETE product by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const productId = parseInt(id);

        if (isNaN(productId)) {
            return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
        }

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!existingProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Delete the product
        await prisma.product.delete({
            where: { id: productId }
        });

        return NextResponse.json({
            message: 'Product deleted successfully',
            product: existingProduct
        }, { status: 200 });

    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({
            error: 'Failed to delete product'
        }, { status: 500 });
    }
}