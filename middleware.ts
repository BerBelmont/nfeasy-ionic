import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { USERS } from './lib/auth';
export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  if (url.pathname.startsWith('/api/Login')) return NextResponse.next();
  const auth = req.headers.get('authorization') || '';
  if (USERS.some(u => auth === `Bearer ${u.token}`)) return NextResponse.next();
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
export const config = { matcher: ['/api/:path*'] };
