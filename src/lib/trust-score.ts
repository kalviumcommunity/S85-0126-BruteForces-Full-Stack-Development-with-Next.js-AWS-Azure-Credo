import { prisma } from './db';

const VOUCH_WEIGHT = 1;
const VOUCHES_REQUIRED_FOR_VERIFICATION = 3;

export async function updateTrustScore(businessId: string) {
  // 1. Get vouch count
  const vouches = await prisma.vouch.count({
    where: { receiver_business_id: businessId }
  });

  const newScore = vouches * VOUCH_WEIGHT;

  // 2. Check Verification Threshold
  const isVerified = vouches >= VOUCHES_REQUIRED_FOR_VERIFICATION;

  // 3. Update Business
  await prisma.business.update({
    where: { id: businessId },
    data: {
      trust_score: newScore,
      is_verified: isVerified
    }
  });

  return {
    newScore,
    isVerified
  };
}
