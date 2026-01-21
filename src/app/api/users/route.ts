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
}
