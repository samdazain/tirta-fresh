import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const adminId = parseInt(id);

        const admin = await prisma.admin.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'Admin user not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ admin });

    } catch (error) {
        console.error('Error fetching admin:', error);
        return NextResponse.json(
            { error: 'Failed to fetch admin user' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const adminId = parseInt(id);
        const { name, email, password } = await request.json();

        // Check if admin exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { id: adminId }
        });

        if (!existingAdmin) {
            return NextResponse.json(
                { error: 'Admin user not found' },
                { status: 404 }
            );
        }

        // Check if email is being changed and if it already exists
        if (email !== existingAdmin.email) {
            const emailExists = await prisma.admin.findUnique({
                where: { email }
            });

            if (emailExists) {
                return NextResponse.json(
                    { error: 'Email already exists' },
                    { status: 400 }
                );
            }
        }

        // Prepare update data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: any = {
            name,
            email
        };

        // Hash new password if provided
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 12);
        }

        // Update admin
        const updatedAdmin = await prisma.admin.update({
            where: { id: adminId },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        return NextResponse.json({
            success: true,
            admin: updatedAdmin,
            message: 'Admin user updated successfully'
        });

    } catch (error) {
        console.error('Error updating admin:', error);
        return NextResponse.json(
            { error: 'Failed to update admin user' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const adminId = parseInt(id);

        // Check if admin exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { id: adminId }
        });

        if (!existingAdmin) {
            return NextResponse.json(
                { error: 'Admin user not found' },
                { status: 404 }
            );
        }

        // Prevent deletion if it's the last admin
        const adminCount = await prisma.admin.count();
        if (adminCount <= 1) {
            return NextResponse.json(
                { error: 'Cannot delete the last admin user' },
                { status: 400 }
            );
        }

        // Delete admin
        await prisma.admin.delete({
            where: { id: adminId }
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting admin:', error);
        return NextResponse.json(
            { error: 'Failed to delete admin user' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
