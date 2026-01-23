import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isAdminPage = request.nextUrl.pathname.startsWith('/admin');
    const isLoginPage = request.nextUrl.pathname === '/admin/login';

    if (isAdminPage && !isLoginPage && !token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    return NextResponse.next();
}

// daftarin url yg mau di cek di sini
export const config = {
    matcher: ['/admin/:path*'],
};
