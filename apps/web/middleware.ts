import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const supportedLocales = ['vi', 'en'];
const defaultLocale = 'vi';

const getLocale = (request: NextRequest) => {
  const headers = Object.fromEntries(request.headers.entries());
  const languages = new Negotiator({ headers }).languages();

  return match(supportedLocales, languages, defaultLocale);
};

export function middleware(request: NextRequest) {
  let url = request.nextUrl;
  let needRedirect = false;
  const userId = request.cookies.get('userId');
  const token = request.cookies.get('token');
  const refreshToken = request.cookies.get('refreshToken');

  // Redirect if user is not logged in
  const checkPath = /sign(in|up)/;
  if (!checkPath.test(request.nextUrl.pathname) && (!userId || !token)) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  const pathnameHasLocale = supportedLocales.some(
    (locale) =>
      url.pathname.startsWith(`/${locale}/`) || url.pathname === `/${locale}`,
  );

  // Redirect if there is no locale
  if (!pathnameHasLocale) {
    const locale = getLocale(request);
    url.pathname = `/${locale}${url.pathname}`;
    return NextResponse.redirect(url);
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
     */
    '/((?!api|_next/static|_next/image|image|favicon.ico).*)',
  ],
};
