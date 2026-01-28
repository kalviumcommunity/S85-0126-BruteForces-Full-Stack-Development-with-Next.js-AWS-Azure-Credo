import { NextResponse } from "next/server";
import { sanitizeInput } from "@/lib/sanitize";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    // 1. The "Dirty" input (Vulnerable to XSS)
    const dirty = content;

    // 2. The "Clean" input (Safe)
    const clean = sanitizeInput(dirty);

    // Log for the assignment screenshot
    console.log("--------------------------------------------------");
    console.log("⚠️  Dirty Input (Vulnerable):", dirty);
    console.log("✅ Clean Input (Sanitized): ", clean);
    console.log("--------------------------------------------------");

    return NextResponse.json({ 
      original: dirty, 
      sanitized: clean,
      message: "Input processed. Check server console logs." 
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}