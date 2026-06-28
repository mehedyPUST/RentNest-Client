// src/proxy.js
import { NextResponse } from 'next/server';

// ✅ Protected Routes
const protectedRoutes = {
    admin: ['/dashboard/admin', '/dashboard/admin/:path*'],
    owner: ['/dashboard/owner', '/dashboard/owner/:path*'],
    tenant: ['/dashboard/tenant', '/dashboard/tenant/:path*'],
};

// ✅ Public Routes
const publicRoutes = ['/', '/all-properties', '/login', '/register', '/api/auth'];

// ✅ Check route match
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

    // ✅ Skip API routes
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // ✅ Skip public routes
    if (publicRoutes.some(p => pathname === p || pathname.startsWith(p + '/'))) {
        return NextResponse.next();
    }

    // ✅ Check if protected
    const isProtected = Object.values(protectedRoutes).some(routes =>
        matchesPattern(pathname, routes)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    // ✅ Get session using Better Auth internal API
    try {
        const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

        // ✅ Call Better Auth get-session API
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

        // ✅ Role-based access
        const isAdminRoute = matchesPattern(pathname, protectedRoutes.admin);
        const isOwnerRoute = matchesPattern(pathname, protectedRoutes.owner);
        const isTenantRoute = matchesPattern(pathname, protectedRoutes.tenant);

        if (isAdminRoute && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (isOwnerRoute && userRole !== 'owner' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (isTenantRoute && userRole !== 'tenant' && userRole !== 'owner' && userRole !== 'admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
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
