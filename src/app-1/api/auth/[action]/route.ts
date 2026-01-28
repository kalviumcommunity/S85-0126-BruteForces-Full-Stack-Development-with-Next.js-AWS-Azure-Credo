import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createToken, verifyToken, ROLES, logAccess } from "@/lib/auth";

// GET Handler (Protected Info)
export async function GET(req: Request, { params }: { params: { action: string } }) {
  if (params.action === "me") {
    return NextResponse.json({ message: "You are authenticated!" });
  }
  return NextResponse.json({ error: "Not Found" }, { status: 404 });
}

// POST Handler (Login, Refresh, Admin Actions)
export async function POST(req: Request, { params }: { params: { action: string } }) {
  const cookieStore = cookies();
  const body = await req.json().catch(() => ({})); // Safe parse

  // ➤ LOGIN FLOW (Updated to accept Role)
  if (params.action === "login") {
    // Determine role based on password for demo purposes
    // password "admin123" -> Admin
    // password "viewer123" -> Viewer
    const { password } = body;
    let role = "viewer";
    
    if (password === "admin123") role = "admin";
    else if (password !== "viewer123") return NextResponse.json({ error: "Invalid creds" }, { status: 401 });

    const user = { id: "1", role };
    const access = await createToken(user, "access");
    const refresh = await createToken(user, "refresh");

    cookieStore.set("refreshToken", refresh, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/"
    });

    return NextResponse.json({ accessToken: access, role });
  }

  // ➤ ADMIN ACTION (Simulated Delete)
  if (params.action === "admin-action") {
    // 1. Verify User (Middleware already checked the token validity, but we check permissions logic here)
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.split(" ")[1] || "";
    const payload = await verifyToken(token, "access");
    
    // @ts-ignore
    const userRole = payload?.role || "unknown";

    // 2. Check Permission: Can this role 'delete'?
    // @ts-ignore
    const canDelete = ROLES[userRole]?.includes("delete");

    // 3. Audit Log
    logAccess(userRole, "delete_resource", canDelete);

    if (!canDelete) {
      return NextResponse.json({ error: "Permission Denied" }, { status: 403 });
    }

    return NextResponse.json({ success: true, message: "Resource DELETED (Admin Action)" });
  }

  // ➤ REFRESH FLOW (Same as before)
  if (params.action === "refresh") {
    const refreshToken = cookieStore.get("refreshToken")?.value;
    if (!refreshToken) return NextResponse.json({ error: "No token" }, { status: 401 });
    const payload = await verifyToken(refreshToken, "refresh");
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // @ts-ignore
    const newAccess = await createToken({ id: payload.id, role: payload.role }, "access");
    return NextResponse.json({ accessToken: newAccess });
  }

  return NextResponse.json({ error: "Invalid Action" }, { status: 400 });
}