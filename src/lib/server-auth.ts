import { prisma } from './db';
import { createClient } from './supabase/server';

export async function getAuthenticatedUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user ||!user.email) return null;

  // Find user in Prisma DB
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
  });

  return dbUser;
}
