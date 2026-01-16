import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Vansh Thapar",
      email: "vansh@credo.dev",
      businesses: {
        create: {
          name: "Credo Local Store",
          category: "Retail",
          description: "Trusted neighborhood store",
          credoScore: 42,
          reviews: {
            create: {
              rating: 5,
              comment: "Very reliable business"
            }
          },
          endorsements: {
            create: {
              endorser: "Community Member"
            }
          }
        }
      }
    }
  })

  console.log("Seeded user:", user)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
