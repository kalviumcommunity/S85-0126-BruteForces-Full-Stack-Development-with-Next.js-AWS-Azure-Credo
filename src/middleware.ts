import { NextResponse, type NextRequest } from "next/server";
import { verifyToken } from "./lib-1/auth";

export async function middleware(req: NextRequest) {
  // Only protect specific routes
  if (req.nextUrl.pathname.startsWith("/api/auth/me")) {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    
    if (!token || !(await verifyToken(token, "access"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  return NextResponse.next();
}

// Only run on the protected route (skips login/refresh)
export const config = { matcher: ["/api/auth/me"] };