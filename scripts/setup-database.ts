#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client';
import DatabaseConnection from '../src/lib/database';

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Test database connection
    console.log('1️⃣ Testing database connection...');
    const isConnected = await DatabaseConnection.testConnection();
    
    if (!isConnected) {
      console.error('❌ Database connection failed. Please check your DATABASE_URL.');
      process.exit(1);
    }
    console.log('✅ Database connection successful!\n');

    // Get database info
    console.log('2️⃣ Getting database information...');
    const dbInfo = await DatabaseConnection.getDatabaseInfo();
    console.log('📊 Database Info:');
    console.log(`   - Database: ${dbInfo.current_database}`);
    console.log(`   - User: ${dbInfo.current_user}`);
    console.log(`   - Version: ${dbInfo.version.split(' ')[0]}`);
    console.log(`   - Server Time: ${dbInfo.server_time}\n`);

    // Run database migrations
    console.log('3️⃣ Running database migrations...');
    const { execSync } = require('child_process');
    try {
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('✅ Migrations completed!\n');
    } catch (error) {
      console.log('ℹ️ No new migrations to apply or migration failed\n');
    }

    // Generate Prisma client
    console.log('4️⃣ Generating Prisma client...');
    try {
      execSync('npx prisma generate', { stdio: 'inherit' });
      console.log('✅ Prisma client generated!\n');
    } catch (error) {
      console.error('❌ Failed to generate Prisma client:', error);
      process.exit(1);
    }

    // Check if tables exist
    console.log('5️⃣ Checking database tables...');
    const tables = await prisma.$queryRaw<Array<{tablename: string}>>`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    `;
    
    console.log('📋 Found tables:');
    tables.forEach((table) => {
      console.log(`   - ${table.tablename}`);
    });
    console.log('');

    // Check user count
    console.log('6️⃣ Checking existing data...');
    const userCount = await prisma.user.count();
    const businessCount = await prisma.business.count();
    const reviewCount = await prisma.review.count();
    
    console.log('📊 Data Summary:');
    console.log(`   - Users: ${userCount}`);
    console.log(`   - Businesses: ${businessCount}`);
    console.log(`   - Reviews: ${reviewCount}\n`);

    // Test API endpoint
    console.log('7️⃣ Testing API endpoint...');
    const testResponse = await fetch('http://localhost:3000/api/test-db');
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ API endpoint test successful!');
      console.log('📊 API Response:', JSON.stringify(testData, null, 2));
    } else {
      console.log('⚠️ API endpoint test failed. Make sure the development server is running.');
    }

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the development server: npm run dev');
    console.log('   2. Visit the database status page: http://localhost:3000/database-status');
    console.log('   3. Test the API endpoint: http://localhost:3000/api/test-db');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;
