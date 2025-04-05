import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  const isAuthPage = request.nextUrl.pathname === '/'
  const isDashboardPage = request.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboardPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
}