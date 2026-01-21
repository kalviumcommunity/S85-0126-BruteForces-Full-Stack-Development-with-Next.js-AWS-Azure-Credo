import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Input Validation Schema
const businessSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  description: z.string().optional(),
  ownerId: z.number(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = businessSchema.parse(body);

    const business = await prisma.business.create({
      data: {
        ...validatedData,
        credoScore: 50, // Initial trust score
      },
    });

    return NextResponse.json({ success: true, data: business }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const businesses = await prisma.business.findMany({
      include: {
        _count: { select: { reviews: true, endorsements: true } },
      },
      orderBy: { credoScore: 'desc' }
    });
    return NextResponse.json({ success: true, data: businesses });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}