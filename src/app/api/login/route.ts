// src/app/api/login/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  const usersRaw = process.env.APP_USERS;
  if (!usersRaw) {
    return NextResponse.json({ success: false, message: 'No users defined' }, { status: 500 });
  }

  const users: Record<string, string> = {};
  usersRaw.split(',').forEach((pair) => {
    const [user, pass] = pair.split(':');
    if (user && pass) {
      users[user] = pass;
    }
  });

  if (users[username] && users[username] === password) {
    const res = NextResponse.json({ success: true });

    res.headers.append(
      'Set-Cookie',
      `auth=true; Path=/; Max-Age=${60 * 60 * 8}`
    );
    res.headers.append(
      'Set-Cookie',
      `username=${username}; Path=/; Max-Age=${60 * 60 * 8}`
    );

    return res;
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
