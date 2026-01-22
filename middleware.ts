import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const isDashboardPage = request.nextUrl.pathname.startsWith('/admin/pages');

    if (isDashboardPage && !token) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
}

// daftarin url yg mau di cek di sini
export const config = {
    matcher: ['/admin/pages/:path*'],
};
