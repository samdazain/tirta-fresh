import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin-token');

        if (!token || !token.value) {
            return NextResponse.json(
                { authenticated: false },
                { status: 200 }
            );
        }

        try {
            // Verify JWT token using jose
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token.value, secret);

            return NextResponse.json(
                {
                    authenticated: true,
                    user: {
                        username: payload.username,
                        role: payload.role
                    }
                },
                { status: 200 }
            );
        } catch (error) {
            console.error('Token verification failed:', error);
            const response = NextResponse.json(
                { authenticated: false, error: 'Invalid token' },
                { status: 200 }
            );
            response.cookies.delete('admin-token');
            return response;
        }
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(
            { authenticated: false, error: 'Session check failed' },
            { status: 200 }
        );
    }
}