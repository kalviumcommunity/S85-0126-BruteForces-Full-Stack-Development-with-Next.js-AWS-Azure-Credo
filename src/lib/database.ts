import { PrismaClient } from '@prisma/client';

// Database connection utility
class DatabaseConnection {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new PrismaClient({
        log: ['query', 'info', 'warn', 'error'],
      });
    }
    return DatabaseConnection.instance;
  }

  public static async testConnection(): Promise<boolean> {
    try {
      const prisma = DatabaseConnection.getInstance();
      await prisma.$connect();
      
      // Test basic query
      await prisma.$queryRaw`SELECT 1`;
      
      console.log('✅ Database connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    } finally {
      await DatabaseConnection.instance.$disconnect();
    }
  }

  public static async getDatabaseInfo() {
    try {
      const prisma = DatabaseConnection.getInstance();
      await prisma.$connect();
      
      const result = await prisma.$queryRaw<{
        server_time: Date;
        version: string;
        current_database: string;
        current_user: string;
      }[]>`
        SELECT 
          NOW() as server_time,
          version() as version,
          current_database() as current_database,
          current_user as current_user
      `;
      
      return result[0];
    } catch (error) {
      console.error('Error getting database info:', error);
      throw error;
    } finally {
      await DatabaseConnection.instance.$disconnect();
    }
  }
}

export default DatabaseConnection;
