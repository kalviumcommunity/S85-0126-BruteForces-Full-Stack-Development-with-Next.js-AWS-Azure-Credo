'use server'

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function getDashboardData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    redirect('/login');
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: {
      businesses: {
        include: {
          receivedVouches: {
             orderBy: { timestamp: 'desc' },
             take: 5,
             include: {
               voucher: true
             }
          },
          vouchRequests: {
             where: { status: 'PENDING' },
             orderBy: { createdAt: 'desc' },
             take: 5
          }
        }
      }
    }
  });

  if (!dbUser) {
    return null;
  }

  const business = dbUser.businesses[0];

  return {
    user: dbUser,
    business: business || null,
    recentVouches: business?.receivedVouches || [],
    pendingRequests: business?.vouchRequests || []
  };
}
