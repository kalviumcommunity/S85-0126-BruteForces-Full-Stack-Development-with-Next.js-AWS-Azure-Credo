import { NextResponse } from 'next/server';
import { prisma } from '@/lib-1/prisma';

// Test database connection
export async function GET() {
  try {
    console.time('Database Connection Test');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test query
    const result = await prisma.$queryRaw<{server_time: Date, version: string}[]>`SELECT NOW() as server_time, version() as version`;
    console.log('✅ Query executed successfully');
    
    // Test user table access
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    console.timeEnd('Database Connection Test');
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        serverTime: result[0]?.server_time,
        version: result[0]?.version,
        userCount,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.timeEnd('Database Connection Test');
    
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
