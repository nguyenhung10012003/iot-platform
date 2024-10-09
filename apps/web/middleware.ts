import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const userId = request.cookies.get('userId');
  const token = request.cookies.get('token');
  const refreshToken = request.cookies.get('refreshToken');

  if (!refreshToken || !token || !userId) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - signin (signin page)
     * - signup (signup page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|signin|signup).*)',
  ],
};
