// Go up one level (..) to access src
import { prisma } from "../src/lib-1/prisma";
async function main() {
  try {
    console.log("🚀 Connecting to Docker Database...");

    // 1. Write Data
    const user = await prisma.user.create({
      data: {
        email: `docker-${Date.now()}@example.com`,
        name: "Docker Verification User",
      },
    });
    console.log("✅ Successfully created user:", user.email);

    // 2. Read Data
    const count = await prisma.user.count();
    console.log(`✅ Total users in database: ${count}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
