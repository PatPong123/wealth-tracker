import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      email: 'demo@woxa.com',
      password: hashedPassword,
    },
  });

  console.log('Created demo user:', demoUser.username);

  // Create sample portfolio items for demo user
  const portfolioItems = [
    {
      userId: demoUser.id,
      symbol: 'AAPL',
      name: 'Apple Inc.',
      purchasePrice: 175.50,
      quantity: 5,
      assetType: 'Technology',
    },
    {
      userId: demoUser.id,
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      purchasePrice: 240.20,
      quantity: 5,
      assetType: 'Automotive',
    },
    {
      userId: demoUser.id,
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      purchasePrice: 370.00,
      quantity: 20,
      assetType: 'Technology',
    },
    {
      userId: demoUser.id,
      symbol: 'ETH',
      name: 'Ethereum',
      purchasePrice: 2250.00,
      quantity: 3,
      assetType: 'Cryptocurrency',
    },
  ];

  for (const item of portfolioItems) {
    await prisma.portfolioItem.upsert({
      where: {
        id: `${demoUser.id}-${item.symbol}`,
      },
      update: item,
      create: item,
    });
  }

  console.log('Created sample portfolio items');
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
