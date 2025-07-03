// src/app/api/logout/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
  const res = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL));

  // Invalida i cookie
  res.headers.append(
    'Set-Cookie',
    `auth=; Path=/; SameSite=Lax; Secure; Max-Age=0`
  );

  res.headers.append(
    'Set-Cookie',
    `username=; Path=/; SameSite=Lax; Secure; Max-Age=0`
  );

  return res;
}
