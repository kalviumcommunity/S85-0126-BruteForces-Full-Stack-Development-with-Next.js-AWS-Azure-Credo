#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clean existing data
    console.log('1️⃣ Cleaning existing data...');
    await prisma.review.deleteMany();
    await prisma.endorsement.deleteMany();
    await prisma.business.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Database cleaned!\n');

    // Create sample users
    console.log('2️⃣ Creating sample users...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashedpassword123',
          role: 'BUSINESS_OWNER',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          password: 'hashedpassword456',
          role: 'BUSINESS_OWNER',
        },
      }),
      prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: 'hashedpassword789',
          role: 'ADMIN',
        },
      }),
    ]);
    console.log(`✅ Created ${users.length} users!\n`);

    // Create sample businesses
    console.log('3️⃣ Creating sample businesses...');
    const businesses = await Promise.all([
      prisma.business.create({
        data: {
          name: 'Tech Solutions Inc.',
          category: 'Technology',
          description: 'Innovative tech solutions for modern businesses',
          ownerId: users[0].id,
          credoScore: 75,
        },
      }),
      prisma.business.create({
        data: {
          name: 'Green Garden Cafe',
          category: 'Food & Beverage',
          description: 'Organic cafe with fresh, locally-sourced ingredients',
          ownerId: users[1].id,
          credoScore: 82,
        },
      }),
      prisma.business.create({
        data: {
          name: 'Digital Marketing Pro',
          category: 'Marketing',
          description: 'Expert digital marketing services to grow your business',
          ownerId: users[0].id,
          credoScore: 68,
        },
      }),
    ]);
    console.log(`✅ Created ${businesses.length} businesses!\n`);

    // Create sample reviews
    console.log('4️⃣ Creating sample reviews...');
    const reviews = await Promise.all([
      prisma.review.create({
        data: {
          rating: 5,
          comment: 'Excellent service! Highly recommended.',
          businessId: businesses[0].id,
        },
      }),
      prisma.review.create({
        data: {
          rating: 4,
          comment: 'Great experience, will definitely come back.',
          businessId: businesses[1].id,
        },
      }),
      prisma.review.create({
        data: {
          rating: 3,
          comment: 'Good service, but room for improvement.',
          businessId: businesses[2].id,
        },
      }),
    ]);
    console.log(`✅ Created ${reviews.length} reviews!\n`);

    // Create sample endorsements
    console.log('5️⃣ Creating sample endorsements...');
    const endorsements = await Promise.all([
      prisma.endorsement.create({
        data: {
          endorser: 'Tech Industry Expert',
          businessId: businesses[0].id,
        },
      }),
      prisma.endorsement.create({
        data: {
          endorser: 'Food Critic Weekly',
          businessId: businesses[1].id,
        },
      }),
      prisma.endorsement.create({
        data: {
          endorser: 'Marketing Association',
          businessId: businesses[2].id,
        },
      }),
    ]);
    console.log(`✅ Created ${endorsements.length} endorsements!\n`);

    // Display summary
    console.log('📊 Database Seeding Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Businesses: ${businesses.length}`);
    console.log(`   - Reviews: ${reviews.length}`);
    console.log(`   - Endorsements: ${endorsements.length}`);
    console.log('\n🎉 Database seeded successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
