// src/proxy.js
import { NextResponse } from 'next/server';

const protectedRoutes = {
    admin: ['/dashboard/admin', '/dashboard/admin/:path*'],
    owner: ['/dashboard/owner', '/dashboard/owner/:path*'],
    tenant: ['/dashboard/tenant', '/dashboard/tenant/:path*'],
};

const publicRoutes = ['/', '/all-properties', '/login', '/register', '/api/auth'];

const matchesPattern = (path, patterns) => {
    return patterns.some(pattern => {
        if (pattern.includes(':path*')) {
            const base = pattern.replace('/:path*', '');
            return path === base || path.startsWith(base + '/');
        }
        return path === pattern || path.startsWith(pattern + '/');
    });
};

export async function proxy(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    if (publicRoutes.some(p => pathname === p || pathname.startsWith(p + '/'))) {
        return NextResponse.next();
    }

    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next();
    }

    try {
        const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000';

        const sessionRes = await fetch(`${baseUrl}/api/auth/get-session`, {
            headers: {
                Cookie: request.headers.get('cookie') || '',
            },
        });

        if (!sessionRes.ok) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        const sessionData = await sessionRes.json();

        if (!sessionData?.user) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        const userRole = sessionData.user.role?.toLowerCase() || 'tenant';

        const isAdminRoute = matchesPattern(pathname, protectedRoutes.admin);
        const isOwnerRoute = matchesPattern(pathname, protectedRoutes.owner);
        const isTenantRoute = matchesPattern(pathname, protectedRoutes.tenant);

        // ✅ Access Denied - Redirect to Access Denied Page
        if (isAdminRoute && userRole !== 'admin') {
            const deniedUrl = new URL('/access-denied', request.url);
            deniedUrl.searchParams.set('role', 'admin');
            deniedUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(deniedUrl);
        }

        if (isOwnerRoute && userRole !== 'owner' && userRole !== 'admin') {
            const deniedUrl = new URL('/access-denied', request.url);
            deniedUrl.searchParams.set('role', 'owner');
            deniedUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(deniedUrl);
        }

        if (isTenantRoute && userRole !== 'tenant' && userRole !== 'owner' && userRole !== 'admin') {
            const deniedUrl = new URL('/access-denied', request.url);
            deniedUrl.searchParams.set('role', 'tenant');
            deniedUrl.searchParams.set('from', pathname);
            return NextResponse.redirect(deniedUrl);
        }

        return NextResponse.next();

    } catch (error) {
        console.error('❌ Proxy error:', error);
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|public/|images/|fonts/).*)',
    ],
};