import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json(
            { message: 'Logout successful' },
            { status: 200 }
        );

        // Clear the admin token cookie
        response.cookies.set('admin-token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 0, // Expire immediately
            path: '/',
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json(
            { error: 'Logout failed' },
            { status: 500 }
        );
    }
}
