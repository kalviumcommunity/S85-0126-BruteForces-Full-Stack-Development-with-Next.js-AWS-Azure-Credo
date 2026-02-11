import { prisma } from './db';
import { createClient } from './supabase/server';

export async function getAuthenticatedUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user ||!user.email) return null;

  // Find user in Prisma DB
  let dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  if (!dbUser) {
    try {
      dbUser = await prisma.user.create({
        data: { email: user.email },
      });
    } catch (error) {
      console.error('Error creating user in Prisma:', error);
      return null;
    }
  }

  return dbUser;
}
