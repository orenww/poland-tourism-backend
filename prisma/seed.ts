import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        key: 'locations',
        icon: 'map-pin',
        order: 1, // ADD THIS
      },
    }),
    prisma.category.create({
      data: {
        key: 'attractions',
        icon: 'compass',
        order: 2, // ADD THIS
      },
    }),
    prisma.category.create({
      data: {
        key: 'routes',
        icon: 'route',
        order: 3, // ADD THIS
      },
    }),
  ]);

  console.log('Seeded categories:', categories);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
