import { NextResponse } from "next/server";
import { projectSchema } from "@/lib/schemas/projectSchema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zod Validation
    const validatedData = projectSchema.parse(body);

    return NextResponse.json(
      { success: true, message: "Project created", data: validatedData },
      { status: 201 }
    );
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
      { success: false, message: "Internal Error" },
      { status: 500 }
    );
  }
}
