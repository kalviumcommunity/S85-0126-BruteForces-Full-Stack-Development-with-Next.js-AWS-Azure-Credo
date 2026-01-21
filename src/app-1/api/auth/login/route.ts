import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client"; // <--- Import Prisma
import { loginSchema } from "@/lib-1/schemas/authSchema";
import { ZodError } from "zod";

const prisma = new PrismaClient(); // <--- Initialize Prisma
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Zod Validation
    const validatedData = loginSchema.parse(body);

    // 2. Find User in Database (Replaces Mock User)
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Verify Password
    // Note: Since our seed data uses plain text passwords (e.g., "adminpassword123"),
    // we compare directly. In production, use bcrypt.compare() here.
    if (user.password !== validatedData.password) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 4. Generate JWT with ROLE
    // CRITICAL: We added "role: user.role" so the middleware can check if they are ADMIN
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // <--- This is the key part for your assignment!
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation Error",
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
