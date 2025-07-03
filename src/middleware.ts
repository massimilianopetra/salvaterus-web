// middleware.ts

import { NextRequest, NextResponse } from 'next/server';

// Lista dei path pubblici (accessibili senza login)
const PUBLIC_PATHS = ['/login', '/api/login', '/api/logout', '/favicon.ico', '/_next', '/_next/static', '/_next/image'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get('auth')?.value;
  const username = request.cookies.get('username')?.value;

  const isLoggedIn = auth === 'true' && !!username;

  /*
  console.log("🔐 Middleware Debug:");
  console.log("Path:", pathname);
  console.log("Auth:", auth);
  console.log("Username:", username);
  console.log("isLoggedIn:", isLoggedIn);
*/

  // Se il path è pubblico, lascia passare
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    console.log("➡️ Accesso consentito (public path)");
    return NextResponse.next();
  }

  // Se non loggato, redirect a /login
  if (!isLoggedIn) {
    console.log("🚫 Non autenticato, redirect a /login");
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  console.log("✅ Accesso autenticato");
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/login|api/logout|login|_next/static|_next/image|favicon.ico).*)',
  ],
};
