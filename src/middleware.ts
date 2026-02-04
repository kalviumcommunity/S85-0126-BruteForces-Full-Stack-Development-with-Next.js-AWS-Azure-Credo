import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Protect Dashboard Routes
  if (path.startsWith("/dashboard")) {
    
    // Check for Supabase session cookies
    // Note: With @supabase/ssr, you would use createServerClient and standard cookie handling
    // For this basic middleware without cookie parsing libraries, we check for the standard sb- token
    // Or we rely on the client logic. 
    // However, middleware should catch unauth requests.
    
    // Simplest check: iterate cookies for 'sb-[project-ref]-auth-token'
    const hasAuthCookie = req.cookies.getAll().some(cookie => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));
    
    // NOTE: This is a weak check. In production, use @supabase/ssr updateSession() 
    // to properly validate the JWT.
    
    if (!hasAuthCookie) {
         const url = req.nextUrl.clone();
         url.pathname = '/login';
         return NextResponse.redirect(url);
    }
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
     * - public (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
