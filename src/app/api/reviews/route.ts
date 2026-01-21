import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema to ensure data is clean before it hits the DB
const reviewSchema = z.object({
  businessId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(2),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const { businessId, rating, comment } = reviewSchema.parse(body);

    // 2. Database Transaction (Optimization Tip: Do updates together!)
    // We create the review AND update the business score in one go if possible, 
    // but for now, we will do them sequentially to keep it readable.
    
    const review = await prisma.review.create({
      data: {
        businessId,
        rating,
        comment,
      },
    });

    // Simple (Naïve) Score Update Logic
    // In a real app, you might defer this or use a database trigger.
    await prisma.business.update({
      where: { id: businessId },
      data: { credoScore: { increment: 2 } } // Dummy logic: +2 score per review
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
  }
}