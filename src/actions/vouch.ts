'use server';

import { prisma } from '@/lib/db';
import { updateTrustScore } from '@/lib/trust-score';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/lib/server-auth';

// Authenticated Vouch Action
export async function vouchForBusiness(receiverId: string) {
  try {
    // 1. Auth Check - Using logic from lib/server-auth.ts
    const user = await getAuthenticatedUser();
    
    if (!user) {
        return { success: false, message: "Unauthorized. Please log in." };
    }
    
    const voucherId = user.id;

    if (voucherId === receiverId) {
      return { success: false, message: "You cannot vouch for yourself." };
    }

    // 2. Check if user already vouched
    const existingVouch = await prisma.vouch.findUnique({
      where: {
        vouch_sender_id_vouch_receiver_id: {
          vouch_sender_id: voucherId,
          vouch_receiver_id: receiverId,
        },
      },
    });

    if (existingVouch) {
      return { success: false, message: "You have already vouched for this business." };
    }

    // 3. Create Vouch
    await prisma.vouch.create({
      data: {
        vouch_sender_id: voucherId,
        vouch_receiver_id: receiverId,
      },
    });

    // 4. Update Trust Score
    const result = await updateTrustScore(receiverId);

    revalidatePath('/dashboard');
    return { 
      success: true, 
      message: "Vouch submitted successfully!",
      newScore: result.newScore,
      newTier: result.newTier
    };

  } catch (error) {
    console.error("Vouch Error:", error);
    return { success: false, message: "Failed to submit vouch." };
  }
}
