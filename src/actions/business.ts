'use server'

import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const businessSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().optional(),
})

export async function createBusiness(prevState: any, formData: FormData) {
  const dbUser = await getAuthenticatedUser()

  if (!dbUser) {
    return { error: "User not authenticated" }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string

  // Validate
  const result = businessSchema.safeParse({ name, description, address })
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  // Generate Slug
  let baseSlug = name.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
  if (!baseSlug) baseSlug = "business";
  
  let slug = baseSlug;
  let counter = 1;
  
  // Ensure uniqueness
  while (await prisma.business.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
  }

  try {
    await prisma.business.create({
      data: {
        name,
        description,
        address,
        ownerId: dbUser.id,
        slug
      }
    })
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to create business. Please try again." }
  }

  redirect(`/dashboard`)
}
