import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Example User 1: Business Owner
  const user1 = await prisma.user.upsert({
    where: { email: "owner@example.com" },
    update: {},
    create: {
      email: "owner@example.com",
      name: "Alice Owner",
      password: "securepassword123", // <--- ADD THIS LINE
      role: "BUSINESS_OWNER",
      businesses: {
        create: {
          name: "Alice Bakery",
          category: "Food",
          description: "Best cakes in town",
          credoScore: 50,
        },
      },
    },
  });

  // Example User 2: Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Super Admin",
      password: "adminpassword123", // <--- ADD THIS LINE
      role: "ADMIN", // This gives you a test user for your Middleware!
    },
  });

  console.log({ user1, admin });
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
