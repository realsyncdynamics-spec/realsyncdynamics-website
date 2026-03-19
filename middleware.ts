import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/login', '/signup', '/pricing', '/features'];

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/api/'))) {
    return response;
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (pathname === '/app' || pathname === '/app/') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  const orgMatch = pathname.match(/^\/([^\/]+)\/(.+)/);
  if (orgMatch) {
    response.headers.set('x-org-slug', orgMatch[1]);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
