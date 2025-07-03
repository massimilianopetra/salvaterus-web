// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/api/login',
  '/api/logout',
  '/favicon.ico',
  '/_next',
  '/_next/static',
  '/_next/image',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get('auth')?.value;
  const username = request.cookies.get('username')?.value;

  const isLoggedIn = auth === 'true' && !!username;

  /*
  console.log("🔐 Middleware");
  console.log("Path:", pathname);
  console.log("Auth:", auth);
  console.log("Username:", username);
  console.log("isLoggedIn:", isLoggedIn);
*/

  // Se l'utente è loggato e sta cercando di andare su / o /login → lo mando su /dashboard
  if (isLoggedIn && (pathname === '/' || pathname === '/login')) {
    console.log("🔄 Loggato e su / o /login → redirect a /dashboard");
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Accesso consentito alle pagine pubbliche
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path + '/'))) {
    console.log("✅ Public path → accesso consentito");
    return NextResponse.next();
  }

  // Protezione per tutte le pagine sotto /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      console.log("🚫 Non autenticato su /dashboard → redirect a /login");
      return NextResponse.redirect(new URL('/login', request.url));
    }
    console.log("✅ Autenticato su /dashboard");
    return NextResponse.next();
  }

  // Tutto il resto (altre pagine non protette)
  console.log("✅ Accesso a path non protetto o non gestito");
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
