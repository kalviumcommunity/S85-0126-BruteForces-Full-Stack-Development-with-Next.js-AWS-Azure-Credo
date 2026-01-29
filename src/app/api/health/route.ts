import { NextResponse } from 'next/server';
import { prisma } from '@/lib-1/prisma';
import redis from '@/lib-1/redis';

interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
      error?: string;
    };
    redis: {
      status: 'connected' | 'disconnected';
      responseTime?: number;
      error?: string;
    };
    api: {
      status: 'operational';
      version: string;
    };
  };
  metrics: {
    uptime: number;
    memoryUsage: NodeJS.MemoryUsage;
    userCount?: number;
    businessCount?: number;
  };
}

export async function GET() {
  const startTime = Date.now();
  const healthStatus: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: 'disconnected',
      },
      redis: {
        status: 'disconnected',
      },
      api: {
        status: 'operational',
        version: process.env.npm_package_version || '1.0.0',
      },
    },
    metrics: {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    },
  };

  try {
    // Test database connection
    const dbStartTime = Date.now();
    await prisma.$connect();
    
    // Test database query
    await prisma.$queryRaw`SELECT 1`;
    
    // Get metrics
    const userCount = await prisma.user.count();
    const businessCount = await prisma.business.count();
    
    healthStatus.services.database = {
      status: 'connected',
      responseTime: Date.now() - dbStartTime,
    };
    
    healthStatus.metrics.userCount = userCount;
    healthStatus.metrics.businessCount = businessCount;
    
  } catch (error) {
    healthStatus.services.database = {
      status: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown database error',
    };
    healthStatus.status = 'unhealthy';
  }

  // Test Redis connection (if Redis is configured)
  if (process.env.REDIS_URL) {
    try {
      const redisStartTime = Date.now();
      await redis.ping();
      
      healthStatus.services.redis = {
        status: 'connected',
        responseTime: Date.now() - redisStartTime,
      };
    } catch (error) {
      healthStatus.services.redis = {
        status: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown Redis error',
      };
      // Don't mark as unhealthy if Redis fails (it's optional)
    }
  }

  const totalTime = Date.now() - startTime;
  
  return NextResponse.json({
    ...healthStatus,
    responseTime: totalTime,
  }, {
    status: healthStatus.status === 'healthy' ? 200 : 503,
  });
}
