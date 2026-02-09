'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/lib/server-auth';

// Authenticated Vouch Action
export async function vouchForBusiness(receiverId: string) {
  try {
    // 1. Auth Check
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
        voucher_id_receiver_business_id: {
          voucher_id: voucherId,
          receiver_business_id: receiverId,
        },
      },
    });

    if (existingVouch) {
      return { success: false, message: "You have already vouched for this business." };
    }

    // 3. Logic: Calculate Vouch Weight based on Voucher's Business Tier
    // We assume the user creates a vouch using the weight of their PRIMARY business.
    const userBusiness = await prisma.business.findFirst({
        where: { ownerId: voucherId }
    });

    let weight = 1; // Default for UNVERIFIED or No Business

    if (userBusiness?.tier === 'BRONZE') weight = 1;
    if (userBusiness?.tier === 'SILVER') weight = 3;
    if (userBusiness?.tier === 'GOLD') weight = 5;

    // 4. Transaction: Create Vouch -> Upgrade Score -> Check Tier
    await prisma.$transaction(async (tx) => {
        // A. Create Vouch
        await tx.vouch.create({
            data: {
                voucher_id: voucherId,
                receiver_business_id: receiverId,
                weight: weight
            }
        });

        // B. Increment Trust Score
        const updatedBusiness = await tx.business.update({
            where: { id: receiverId },
            data: {
                trust_score: { increment: weight }
            }
        });

        // C. Check & Update Tier (Auto-Promote)
        let newTier = updatedBusiness.tier;
        if (updatedBusiness.trust_score > 100) newTier = 'GOLD';
        else if (updatedBusiness.trust_score > 50) newTier = 'SILVER';
        else if (updatedBusiness.trust_score > 10) newTier = 'BRONZE';
        
        // Only update if tier changed
        if (newTier !== updatedBusiness.tier) {
            await tx.business.update({
                where: { id: receiverId },
                data: { tier: newTier, is_verified: true } // Bronze+ implies verified
            });
        }
    });

    revalidatePath('/dashboard');
    revalidatePath(`/business/${receiverId}`);
    
    return { success: true, message: "Vouch recorded successfully!" };
  } catch (error) {
    console.error("Vouch Error:", error);
    return { success: false, message: "Failed to record vouch." };
  }
}
