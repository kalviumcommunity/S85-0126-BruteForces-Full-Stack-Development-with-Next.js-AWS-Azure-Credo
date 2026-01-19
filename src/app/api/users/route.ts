import { NextResponse } from "next/server";

const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  return NextResponse.json({
    page,
    limit,
    data: users,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name) {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { message: "User created", data: body },
    { status: 201 }
  );
}
