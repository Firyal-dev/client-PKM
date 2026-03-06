import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const url = request.nextUrl;
    const pathname = url.pathname;

    const hostname = request.headers.get('host') || '';
    
    const hostWithoutPort = hostname.split(':')[0];
    
    let tenantSlug = 'default'; 
    
    if (hostWithoutPort !== 'localhost' && !hostWithoutPort.startsWith('127.0.0.1')) {
        tenantSlug = hostWithoutPort.split('.')[0];
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-slug', tenantSlug);

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