import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: 1, task: "Setup API routes" },
    { id: 2, task: "Write README" },
  ]);
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(
    { message: "Task created", data: body },
    { status: 201 }
  );
}
