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

    // Skip API routes
    if (pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    // Skip public routes
    if (publicRoutes.some(p => pathname === p || pathname.startsWith(p + '/'))) {
        return NextResponse.next();
    }

    // Check if protected
    const isProtected = Object.values(protectedRoutes).some(routes =>
        matchesPattern(pathname, routes)
    );

    if (!isProtected) {
        return NextResponse.next();
    }

    try {
        // ✅ Better Auth Session Cookie
        const sessionCookie = request.cookies.get('rentnest_session')?.value;

        console.log('🔍 Session Cookie:', sessionCookie ? 'exists' : 'not found');

        if (!sessionCookie) {
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // ✅ Parse session
        let user = null;
        let userRole = 'tenant';

        try {
            const sessionData = JSON.parse(sessionCookie);
            user = sessionData?.user;
            userRole = user?.role?.toLowerCase() || 'tenant';
        } catch {
            try {
                const decoded = Buffer.from(sessionCookie, 'base64').toString('utf-8');
                const sessionData = JSON.parse(decoded);
                user = sessionData?.user;
                userRole = user?.role?.toLowerCase() || 'tenant';
            } catch {
                console.log('❌ Failed to parse session');
                const loginUrl = new URL('/login', request.url);
                loginUrl.searchParams.set('redirect', pathname);
                return NextResponse.redirect(loginUrl);
            }
        }

        if (!user) {
            console.log('❌ No user in session');
            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }

        console.log('✅ User:', user.email, 'Role:', userRole);

        // ✅ Role-based access - সঠিক চেক
        const isAdminRoute = matchesPattern(pathname, protectedRoutes.admin);
        const isOwnerRoute = matchesPattern(pathname, protectedRoutes.owner);
        const isTenantRoute = matchesPattern(pathname, protectedRoutes.tenant);

        // ✅ Admin routes - শুধু Admin
        if (isAdminRoute && userRole !== 'admin') {
            console.log('❌ Access denied: Admin role required');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // ✅ Owner routes - Owner + Admin (Admin সব দেখতে পারে)
        if (isOwnerRoute && userRole !== 'owner' && userRole !== 'admin') {
            console.log('❌ Access denied: Owner role required');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // ✅ Tenant routes - Tenant + Owner + Admin (সবাই দেখতে পারে)
        if (isTenantRoute && userRole !== 'tenant' && userRole !== 'owner' && userRole !== 'admin') {
            console.log('❌ Access denied: Tenant role required');
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        console.log('✅ Access granted to:', pathname);
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