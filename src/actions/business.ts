'use server'

import { prisma } from "@/lib/db"
import { getAuthenticatedUser } from "@/lib/server-auth"
import { redirect } from "next/navigation"
import { z } from "zod"

const businessSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
  documents: z.string().optional() // JSON string
})


export async function updateBusiness(prevState: any, formData: FormData) {
  const dbUser = await getAuthenticatedUser()

  if (!dbUser) {
    return { error: "User not authenticated" }
  }

  const businessId = formData.get('businessId') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const profileImage = formData.get('profileImage') as string
  const documentsJson = formData.get('documents') as string

  // Parse Documents
  let parsedDocuments: string[] = [];
  try {
      if (documentsJson) parsedDocuments = JSON.parse(documentsJson);
  } catch (e) {
      console.error("Failed to parse documents JSON", e);
  }

  // Validate Ownership
  const business = await prisma.business.findFirst({
    where: { id: businessId, ownerId: dbUser.id }
  })

  if (!business) {
    return { error: "Business not found or unauthorized" }
  }

  try {
    await prisma.business.update({
      where: { id: businessId },
      data: {
        name,
        description,
        address,
        profileImage: profileImage || null,
        documents: parsedDocuments
      }
    })
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to update business." }
  }

  // Revalidate paths if needed
  // revalidatePath('/dashboard/settings')
  return { success: "Business updated successfully" }
}

export async function createBusiness(prevState: any, formData: FormData) {
  const dbUser = await getAuthenticatedUser()

  if (!dbUser) {
    return { error: "User not authenticated" }
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string
  const profileImage = formData.get('profileImage') as string
  const documentsJson = formData.get('documents') as string

  // Validate
  const result = businessSchema.safeParse({ name, description, address, profileImage, documents: documentsJson })
  if (!result.success) {
    return { error: result.error.errors[0].message }
  }

  // Parse Documents
  let parsedDocuments: string[] = [];
  try {
      if (documentsJson) parsedDocuments = JSON.parse(documentsJson);
  } catch (e) {
      console.error("Failed to parse documents JSON", e);
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
        slug,
        profileImage: profileImage || null,
        documents: parsedDocuments
      }
    })
  } catch (error) {
    console.error("Database error:", error)
    return { error: "Failed to create business. Please try again." }
  }

  redirect(`/dashboard`)
}
