import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Logout berhasil' },
            { status: 200 }
        );

        // Clear the admin token cookie
        response.cookies.set('admin-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0,
            path: '/',
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        console.error('Error logout:', error);
        return NextResponse.json(
            { error: 'Logout gagal' },
            { status: 500 }
        );
    }
}