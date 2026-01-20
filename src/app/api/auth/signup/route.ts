import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return NextResponse.json({
      message: "Signup successful",
      user: { name, email, password: hashedPassword },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Signup failed" },
      { status: 500 }
    );
  }
}
