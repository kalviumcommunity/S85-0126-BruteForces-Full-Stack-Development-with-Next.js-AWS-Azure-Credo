import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET: Fetch a single business by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      reviews: true,
      _count: { select: { endorsements: true } },
    },
  });

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: business });
}

// DELETE: Remove a business
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  try {
    await prisma.business.delete({
      where: { id },
    });
    return NextResponse.json({ success: true, message: "Business deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Operation failed" }, { status: 500 });
  }
}