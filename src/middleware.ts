import { NextResponse, type NextRequest } from "next/server";
import { verifyToken, ROLES } from "./lib/auth";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Protect Admin Routes (Role Check)
  if (path.startsWith("/admin") || path.includes("/admin-action")) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    
    // Verify Token
    const payload = token ? await verifyToken(token, "access") : null;

    // Check if user exists and has 'admin' role
    // @ts-ignore
    if (!payload || payload.role !== "admin") {
      console.log(`[Middleware] Blocked access to ${path} for role: ${payload?.role || "anonymous"}`);
      return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }
  }

  // 2. Protect General API Routes (Login Check)
  if (path.startsWith("/api/auth/me")) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token || !(await verifyToken(token, "access"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    "/api/auth/me", 
    "/api/auth/admin-action", // We will create this virtual route next
    "/admin/:path*" 
  ] 
};