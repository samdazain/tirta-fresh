import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Token tidak ditemukan', authenticated: false },
                { status: 401 }
            );
        }

        // Verifikasi JWT token
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== 'admin') {
            return NextResponse.json(
                { error: 'Token tidak valid', authenticated: false },
                { status: 403 }
            );
        }

        // Verifikasi admin masih ada di database
        const admin = await prisma.admin.findUnique({
            where: {
                id: payload.adminId as number
            }
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'Admin tidak ditemukan', authenticated: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                authenticated: true,
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email
                },
                role: 'admin'
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error verifying token:', error);
        return NextResponse.json(
            { error: 'Token tidak valid', authenticated: false },
            { status: 401 }
        );
    } finally {
        await prisma.$disconnect();
    }
}