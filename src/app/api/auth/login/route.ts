import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/lib/schemas/authSchema";
import { ZodError } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zod Validation
    const validatedData = loginSchema.parse(body);

    // Mock user (since no DB yet)
    const mockUser = {
      id: 1,
      name: "Moksh",
      email: "moksh@test.com",
      password: "$2b$10$H3D6ZX6D9y3/lhMa5rPOBeAq3JgiczO/omROvqY5e22vvoNjI4xi2",
    };

    if (validatedData.email !== mockUser.email) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(
      validatedData.password,
      mockUser.password
    );
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: mockUser.id, email: mockUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
          // 👇 FIXED: Changed .errors to .issues
          errors: error.issues.map((e) => ({
            field: e.path[0],
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 }
    );
  }
}
