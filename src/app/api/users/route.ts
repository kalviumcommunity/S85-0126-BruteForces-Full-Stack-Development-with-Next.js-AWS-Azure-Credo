import { NextResponse } from "next/server";

// We don't need to verify the token here anymore.
// The Middleware has already checked it!

export async function GET() {
  return NextResponse.json({
    success: true,
    message:
      "User route accessible to all authenticated Business Owners and Admins.",
    // Optional: You could return real user data here if you wanted,
    // but this message is what the assignment asks for.
    data: [
      { id: 1, name: "Alice (Mock Data)" },
      { id: 2, name: "Bob (Mock Data)" },
    ],
  });

import { verifyToken } from "@/lib/auth";
import { handleError } from "@/lib/errorHandler";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;

    return NextResponse.json({ page, limit, data: users });
  } catch (error) {
    return handleError(error, "GET /api/users");
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "User created", data: body },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error, "POST /api/users");
  }
}
