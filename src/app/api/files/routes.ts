import { NextResponse } from "next/server";
import { prisma } from "@/lib-1/prisma";

export async function POST(req: Request) {
  try {
    const { name, url, size, type } = await req.json();

    const file = await prisma.file.create({
      data: { name, url, size, type },
    });

    return NextResponse.json({ success: true, file });
  } catch (error) {
    return NextResponse.json({ success: false, message: "DB insert failed" }, { status: 500 });
  }
}
