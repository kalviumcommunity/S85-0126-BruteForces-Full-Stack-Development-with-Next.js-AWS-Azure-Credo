// File: prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // 1. Create an ADMIN User
  const admin = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      name: "Super Admin",
      password: "admin123", // Simple password for testing
      role: "ADMIN", // <--- CRITICAL: This allows access to admin routes
    },
  });

  // 2. Create a Regular User (Business Owner)
  const user = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      name: "John Business",
      password: "user123",
      role: "BUSINESS_OWNER",
    },
  });

  console.log({ admin, user });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
