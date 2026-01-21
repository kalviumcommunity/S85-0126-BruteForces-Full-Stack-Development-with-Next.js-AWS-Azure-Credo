import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Define the shape of your Token to avoid 'any'
interface DecodedToken extends JwtPayload {
  role?: string;
  email?: string;
  id?: number;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/admin") || pathname.startsWith("/api/users")) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token missing" },
        { status: 401 }
      );
    }

    try {
      // FIX 1: Cast to our interface instead of 'any'
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

      if (pathname.startsWith("/api/admin") && decoded.role !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "Access denied: Admins only" },
          { status: 403 }
        );
      }

      const requestHeaders = new Headers(req.headers);
      // Ensure role is a string before setting header
      if (decoded.role) {
        requestHeaders.set("x-user-role", decoded.role);
      }

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch {
      // FIX 2: Removed unused 'error' variable
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/users/:path*"],
};
