import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const pathname = url.pathname;
    const hostname = request.headers.get('host') || '';
    const hostWithoutPort = hostname.split(':')[0];

    // Extract tenant slug from the first path segment
    const pathParts = pathname.split('/').filter(Boolean);
    const firstSegment = pathParts[0] || '';

    // Define route prefixes that are NOT tenant slugs
    const nonTenantSegments = ['admin', 'puskesmas', 'api', 'maintenance', 'suspended', 'inactive', '_next'];
    
    let tenantSlug = process.env.NEXT_PUBLIC_DEFAULT_TENANT || 'default';

    if (firstSegment && !nonTenantSegments.includes(firstSegment)) {
        tenantSlug = firstSegment;
    }

    // Set headers so server components can see the tenant and current path
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-slug', tenantSlug);
    requestHeaders.set('x-url-pathname', pathname);

    console.log('[Proxy] Path:', pathname, '-> Tenant:', tenantSlug);

    const token = request.cookies.get('token')?.value;
    const isAdminPage = pathname.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    if (isAdminPage && !isLoginPage && !token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
