import { SignJWT, jwtVerify } from "jose";

const ACCESS_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);
const REFRESH_SECRET = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export async function createToken(payload: any, type: "access" | "refresh") {
  const secret = type === "access" ? ACCESS_SECRET : REFRESH_SECRET;
  const exp = type === "access" ? "15m" : "7d"; // 15 mins vs 7 days
  
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