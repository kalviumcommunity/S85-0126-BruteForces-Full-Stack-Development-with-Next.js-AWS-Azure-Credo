import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Mock user (since no DB yet)
    const mockUser = {
      id: 1,
      name: "Moksh",
      email: "moksh@test.com",
      password: "$2b$10$H3D6ZX6D9y3/lhMa5rPOBeAq3JgiczO/omROvqY5e22vvoNjI4xi2"
    };

    if (email !== mockUser.email) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, mockUser.password);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: mockUser.id, email: mockUser.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}
