import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Validasi input
        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username dan password wajib diisi' },
                { status: 400 }
            );
        }

        // Cari admin berdasarkan email
        const admin = await prisma.admin.findUnique({
            where: {
                email: username
            }
        });

        if (!admin) {
            return NextResponse.json(
                { error: 'Email atau password tidak valid' },
                { status: 401 }
            );
        }

        // Verifikasi password
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Password tidak valid' },
                { status: 401 }
            );
        }

        // Buat JWT token menggunakan jose
        const secret = new TextEncoder().encode(JWT_SECRET);
        const token = await new SignJWT({
            adminId: admin.id,
            email: admin.email,
            name: admin.name,
            role: 'admin'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('24h')
            .sign(secret);

        // Buat response
        const response = NextResponse.json(
            {
                message: 'Login berhasil',
                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email
                },
                role: 'admin',
                authenticated: true
            },
            { status: 200 }
        );

        // Set JWT token dalam cookies
        response.cookies.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24, // 24 jam
            path: '/',
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        console.error('Error login:', error);
        return NextResponse.json(
            { error: 'Autentikasi gagal' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}