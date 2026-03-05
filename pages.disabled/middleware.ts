// Archived middleware — moved here to avoid enabling server/edge runtimes.
// If you want to re-enable server-side redirect behavior later, move this
// file back to the project root as `middleware.ts`.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/') {
    const cookie = req.cookies.get('sauth')?.value;
    if (cookie === '1') {
      const url = req.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/index'],
};
