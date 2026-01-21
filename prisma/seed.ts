import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create a User (Business Owner)
  const user = await prisma.user.upsert({
    where: { email: 'alice@credo.local' },
    update: {},
    create: {
      email: 'alice@credo.local',
      name: 'Alice V.',
      password: 'hashedpassword123', // In real app, hash this!
      role: 'BUSINESS_OWNER',
    },
  });

  // 2. Create a Business for Alice
  const business = await prisma.business.create({
    data: {
      name: 'Street Bites Chandigarh',
      category: 'Food & Beverage',
      description: 'Authentic local street food with high hygiene standards.',
      ownerId: user.id,
      credoScore: 85,
      reviews: {
        create: [
          { rating: 5, comment: 'Best momos in sector 17!' },
          { rating: 4, comment: 'Great hygiene, tasty food.' },
        ],
      },
      endorsements: {
        create: [
          { endorser: 'Local Food Safety Officer' },
          { endorser: 'Supplier: FreshFarms' },
        ],
      },
    },
  });

  console.log(`✅ Created business: ${business.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });