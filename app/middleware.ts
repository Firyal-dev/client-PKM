import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  
  const { pathname } = request.nextUrl

  if (token && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  if (!token && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}