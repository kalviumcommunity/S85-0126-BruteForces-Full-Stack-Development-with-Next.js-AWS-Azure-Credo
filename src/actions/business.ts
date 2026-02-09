'use server'

import { prisma } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { z } from "zod"

const businessSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  address: z.string().optional(),
})

export async function createBusiness(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email }
  })

  if (!dbUser) {
    throw new Error("User not found in database")
  }

  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const address = formData.get('address') as string

  // Validate
  const result = businessSchema.safeParse({ name, description, address })
  if (!result.success) {
    return { error: "Invalid data" }
  }

  await prisma.business.create({
    data: {
      name,
      description,
      address,
      ownerId: dbUser.id
    }
  })

  redirect(`/dashboard`)
}
