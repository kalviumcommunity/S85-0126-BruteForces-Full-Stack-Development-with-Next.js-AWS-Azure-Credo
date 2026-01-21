import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Welcome Admin! High security area.",
  });
}
