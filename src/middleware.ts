import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = ['/admin/login'];
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    console.log('=== MIDDLEWARE START ===');
    console.log('Pathname:', pathname);
    console.log('Full URL:', request.url);

    // Skip middleware for non-admin routes
    if (!pathname.startsWith('/admin')) {
        console.log('Not admin route, skipping middleware');
        return NextResponse.next();
    }

    // Allow access to public admin paths
    if (PUBLIC_PATHS.some(path => pathname === path)) {
        console.log('Public admin path, allowing access');
        return NextResponse.next();
    }

    // Check for admin token
    const token = request.cookies.get('admin-token')?.value;
    console.log('Token exists:', !!token);
    console.log('Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'none');

    if (!token) {
        console.log('No token found, redirecting to login');
        const loginUrl = new URL('/admin/login', request.url);
        console.log('Redirect URL:', loginUrl.toString());
        return NextResponse.redirect(loginUrl);
    }

    try {
        // Verify token using jose (Edge Runtime compatible)
        const secret = new TextEncoder().encode(JWT_SECRET);
        const { payload } = await jwtVerify(token, secret);
        console.log('Token verified successfully:', payload);
        console.log('=== MIDDLEWARE END - ALLOWING ACCESS ===');
        return NextResponse.next();
    } catch (error) {
        console.log('Token verification failed:', error);
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin-token');
        console.log('=== MIDDLEWARE END - REDIRECTING DUE TO INVALID TOKEN ===');
        return response;
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};