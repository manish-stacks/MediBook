// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/doctors', '/specialities', '/clinics', '/blog', '/about', '/contact'];
const AUTH_PATHS   = ['/login', '/register', '/forgot-password'];
const PROTECTED_PREFIXES = ['/dashboard', '/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth state from cookie (zustand persist stores in localStorage, not cookies)
  // We check a custom cookie we'll set on login
  const authCookie = request.cookies.get('medibook-auth-token');
  const isLoggedIn = !!authCookie?.value;

  // If already logged in and visiting auth pages, redirect to dashboard
  if (isLoggedIn && AUTH_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protected routes — let client-side handle redirect (Zustand persists in localStorage)
  // We don't redirect here to avoid SSR localStorage access issues
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
