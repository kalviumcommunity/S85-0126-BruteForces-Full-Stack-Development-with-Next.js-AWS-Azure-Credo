import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🏎️  Starting Query Optimization Race...\n");

  // 🔴 BAD WAY (The "N+1" Problem)
  console.time("🔴 Slow Query (N+1)");
  const businesses = await prisma.business.findMany(); // Query 1
  
  for (const b of businesses) {
    const reviews = await prisma.review.findMany({ // Query 2, 3, 4, 5... N
      where: { businessId: b.id } 
    });
    // 👇 FIX: We actually read the 'reviews' variable here to satisfy TypeScript
    process.stdout.write(reviews ? "." : "."); 
  }
  console.log("\n");
  console.timeEnd("🔴 Slow Query (N+1)");


  // 🟢 GOOD WAY (Eager Loading / Join)
  console.time("🟢 Fast Query (Include)");
  const optimizedBusinesses = await prisma.business.findMany({
    include: {
      reviews: true // This performs a JOIN or efficient subquery
    }
  });
  
  console.log(`\nFetched ${optimizedBusinesses.length} businesses with reviews instantly.`);
  console.timeEnd("🟢 Fast Query (Include)");
  
  console.log("\n✅ Practice Complete. Always prefer 'include' or 'select' over loops!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());