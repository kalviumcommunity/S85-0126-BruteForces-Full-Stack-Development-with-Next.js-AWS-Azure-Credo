import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: 1, title: "Credo Platform" },
    { id: 2, title: "Kalvium LMS" },
  ]);
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json(
    { message: "Project created", data: body },
    { status: 201 }
  );
}
