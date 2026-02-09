import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create a User (Business Owner) - Role should be USER based on schema, or we can make them COMMUNITY_LEADER
  const user = await prisma.user.upsert({
    where: { email: 'alice@credo.local' },
    update: {},
    create: {
      email: 'alice@credo.local',
      role: 'USER',
    },
  });

  // 2. Create a Business for Alice
  const business = await prisma.business.create({
    data: {
      name: 'Street Bites Chandigarh',
      description: 'Authentic local street food with high hygiene standards.',
      address: 'Sector 17, Chandigarh',
      ownerId: user.id,
      trust_score: 2,
    },
  });

  // 3. Create Vouchers
  const bob = await prisma.user.create({
    data: { email: 'bob@credo.local', role: 'COMMUNITY_LEADER' }
  });
  
  const charlie = await prisma.user.create({
     data: { email: 'charlie@credo.local', role: 'USER' }
  });

  // 4. Create Vouches
  await prisma.vouch.create({
    data: {
        voucher_id: bob.id,
        receiver_business_id: business.id
    }
  });

  await prisma.vouch.create({
    data: {
        voucher_id: charlie.id,
        receiver_business_id: business.id
    }
  });

  console.log(`✅ Created business: ${business.name} with 2 vouches`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });