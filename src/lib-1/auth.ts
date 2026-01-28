import { SignJWT, jwtVerify } from "jose";

// 1. RBAC Configuration
export const ROLES = {
  admin: ["create", "read", "update", "delete"],
  viewer: ["read"],
};

export type Role = keyof typeof ROLES;

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function createToken(payload: any, type: "access" | "refresh") {
  const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
  const exp = type === "access" ? "15m" : "7d";
  
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyToken(token: string, type: "access" | "refresh") {
  try {
    const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

// Helper to check permission logs
export function logAccess(role: string, action: string, allowed: boolean) {
  const timestamp = new Date().toISOString();
  console.log(`[RBAC Audit] ${timestamp} | Role: ${role} | Action: ${action} | Result: ${allowed ? "ALLOWED" : "DENIED"}`);
}