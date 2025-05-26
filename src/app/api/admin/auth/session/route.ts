import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.json(
                { authenticated: false, error: 'No token found' },
                { status: 401 }
            );
        }

        // Verify JWT token
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);

        if (payload.role !== 'admin') {
            return NextResponse.json(
                { authenticated: false, error: 'Invalid role' },
                { status: 403 }
            );
        }

        return NextResponse.json({
            authenticated: true,
            user: {
                username: payload.username,
                role: payload.role
            }
        });
    } catch (error) {
        console.error('Session verification error:', error);
        return NextResponse.json(
            { authenticated: false, error: 'Invalid token' },
            { status: 401 }
        );
    }
}