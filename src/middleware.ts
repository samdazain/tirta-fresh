import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for public routes and API routes that don't need protection
    if (
        pathname.startsWith('/api/admin/auth') ||
        pathname.startsWith('/admin/login') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.startsWith('/api/orders') ||
        pathname.startsWith('/api/products') ||
        pathname.startsWith('/api/villages') ||
        pathname.startsWith('/api/history')
    ) {
        return NextResponse.next();
    }

    // Protect admin routes
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== 'admin') {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            return NextResponse.next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protect admin API routes
    if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth')) {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);

            if (payload.role !== 'admin') {
                return NextResponse.json(
                    { error: 'Forbidden' },
                    { status: 403 }
                );
            }

            return NextResponse.next();
        } catch (error) {
            console.error('API token verification failed:', error);
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*'
    ]
};