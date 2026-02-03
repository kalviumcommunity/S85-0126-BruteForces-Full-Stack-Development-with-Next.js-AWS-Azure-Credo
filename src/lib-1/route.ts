import { NextResponse } from "next/server";

let users = [
  { id: 1, name: "Alice", email: "alice@test.com" },
  { id: 2, name: "Bob", email: "bob@test.com" },
];

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newUser = {
    id: Date.now(),
    name: body.name,
    email: body.email,
  };

  users.push(newUser);
  return NextResponse.json(newUser, { status: 201 });
}
