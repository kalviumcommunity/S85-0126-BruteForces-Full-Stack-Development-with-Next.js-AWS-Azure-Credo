import { PrismaClient, Tier, Profile } from '@prisma/client';

const prisma = new PrismaClient();

// Points configuration
const POINTS = {
  VOUCH_FROM_BASIC: 10,
  VOUCH_FROM_COMMUNITY: 25, // Intepolated value for Tier 2
  VOUCH_FROM_VERIFIED: 50,
};

// Tier thresholds
const TIER_THRESHOLDS = {
  TIER_2_MIN: 101,
  TIER_3_MIN: 501,
};

/**
 * Calculates and updates the Trust Score and Tier for a profile.
 * Should be called whenever a new vouch is received.
 */
export async function updateTrustScore(profileId: string) {
  // 1. Fetch all vouches received by the profile, including the sender's tier
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      vouchesReceived: {
        include: {
          vouch_sender: true,
        },
      },
    },
  });

  if (!profile) {
    throw new Error('Profile not found');
  }

  // 2. Calculate Score
  let newScore = 0;

  for (const vouch of profile.vouchesReceived) {
    const senderTier = vouch.vouch_sender.current_tier;

    switch (senderTier) {
      case 'BASIC':
        newScore += POINTS.VOUCH_FROM_BASIC;
        break;
      case 'COMMUNITY':
        newScore += POINTS.VOUCH_FROM_COMMUNITY;
        break;
      case 'VERIFIED':
        newScore += POINTS.VOUCH_FROM_VERIFIED;
        break;
      default:
        newScore += 0;
    }
  }

  // 3. Determine New Tier
  let newTier: Tier = 'BASIC';
  
  if (newScore >= TIER_THRESHOLDS.TIER_3_MIN) {
    newTier = 'VERIFIED';
  } else if (newScore >= TIER_THRESHOLDS.TIER_2_MIN) {
    newTier = 'COMMUNITY';
  } else {
    newTier = 'BASIC';
  }

  // 4. Update Profile if changes occurred
  if (newScore !== profile.trust_score || newTier !== profile.current_tier) {
    await prisma.profile.update({
      where: { id: profileId },
      data: {
        trust_score: newScore,
        current_tier: newTier,
      },
    });
  }

  return { newScore, newTier };
}

/**
 * Logic to recalculate score based on a single incoming vouch event
 * (Optimization: Instead of full recalculation, you could just add points, 
 * but full recalc is safer for consistency)
 */
export async function procesVouch(voucherId: string, receiverId: string) {
    if (voucherId === receiverId) {
        throw new Error("Cannot vouch for yourself.");
    }

    // Ensure vouch exists (created elsewhere) or create it here?
    // Assuming this function is called AFTER the Vouch record is created.
    
    return await updateTrustScore(receiverId);
}
