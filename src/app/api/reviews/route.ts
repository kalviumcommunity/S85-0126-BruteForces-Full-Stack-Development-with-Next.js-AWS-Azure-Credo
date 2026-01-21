import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  businessId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { businessId, rating, comment } = reviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        businessId,
        rating,
        comment,
      },
    });

    // Bonus Logic: Update Credo Score when a review is added
    // (Simple logic: Add 2 points per review)
    await prisma.business.update({
      where: { id: businessId },
      data: { credoScore: { increment: 2 } }
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}