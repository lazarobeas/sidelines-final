import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // First, update the session as before
  const response = await updateSession(request);
  
  // Get the current path
  const { pathname } = request.nextUrl;
  
  // Define public routes that should NEVER require authentication
  const publicRoutes = ['/', '/login', '/signup', '/register', '/reset-password'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If this is a public route, just continue without checking auth
  if (isPublicRoute) {
    return response;
  }
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/feed', '/dashboard', '/profile', '/chat'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );
  
  // If this is a protected route, check for authentication
  if (isProtectedRoute) {
    // Check for Supabase auth cookies - looking for any cookie that matches the pattern
    const hasAuthCookie = request.cookies.getAll().some(cookie => 
      cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')
    );
    
    // If no auth cookie exists, redirect to login
    if (!hasAuthCookie) {
      // Create the login URL with a redirect parameter
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', pathname);
      
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  // Continue with the response from updateSession
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}