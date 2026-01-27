import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken, verifyToken } from "@/lib/auth";

// Handle GET requests (e.g., /api/auth/me)
export async function GET(req: Request, { params }: { params: { action: string } }) {
  if (params.action === "me") {
    return NextResponse.json({ 
      success: true, 
      message: "You are accessing a PROTECTED route!", 
      data: "💰 Secret Data: 1000 BTC" 
    });
  }
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

// Handle POST requests (Login & Refresh)
export async function POST(req: Request, { params }: { params: { action: string } }) {
  const cookieStore = cookies();

  // ➤ LOGIN FLOW
  if (params.action === "login") {
    const { email, password } = await req.json();

    // Mock DB Check
    if (email !== "admin@credo.com" || password !== "password") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = { id: "1", role: "admin" };
    const access = await createToken(user, "access");
    const refresh = await createToken(user, "refresh");

    // Set Secure Cookie
    cookieStore.set("refreshToken", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ accessToken: access });
  }

  // ➤ REFRESH FLOW
  if (params.action === "refresh") {
    const refreshToken = cookieStore.get("refreshToken")?.value;
    
    if (!refreshToken) return NextResponse.json({ error: "No token" }, { status: 401 });

    const payload = await verifyToken(refreshToken, "refresh");
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // Rotate tokens (Issue new ones)
    const newAccess = await createToken({ id: payload.id, role: payload.role }, "access");
    
    return NextResponse.json({ accessToken: newAccess });
  }

  return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
}