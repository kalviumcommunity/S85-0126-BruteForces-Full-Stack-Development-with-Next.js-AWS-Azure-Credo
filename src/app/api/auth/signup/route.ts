import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { signupSchema } from "@/lib/schemas/authSchema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zod Validation
    const validatedData = signupSchema.parse(body);

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    return NextResponse.json({
      success: true,
      message: "Signup successful",
      user: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          // 👇 CHANGED: use .issues instead of .errors
          errors: error.issues.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Signup failed" },
      { status: 500 }
    );
  }
}
