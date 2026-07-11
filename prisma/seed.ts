// PLACEHOLDER: This file will be populated with seed data
// Run: npx prisma db seed

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@gametopup.id" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gametopup.id",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Create test user
  const userPassword = await bcrypt.hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "user@gametopup.id" },
    update: {},
    create: {
      name: "Test User",
      email: "user@gametopup.id",
      password: userPassword,
      role: "USER",
    },
  });

  // Create games
  const mobileLegends = await prisma.game.upsert({
    where: { slug: "mobile-legends" },
    update: {},
    create: {
      name: "Mobile Legends",
      slug: "mobile-legends",
      description: "Top up Diamond Mobile Legends dengan harga terbaik",
      category: "MOBA",
      sortOrder: 1,
    },
  });

  const freeFire = await prisma.game.upsert({
    where: { slug: "free-fire" },
    update: {},
    create: {
      name: "Free Fire",
      slug: "free-fire",
      description: "Top up Diamond Free Fire dengan proses instan",
      category: "Battle Royale",
      sortOrder: 2,
    },
  });

  // Create products for Mobile Legends
  await prisma.product.createMany({
    data: [
      { name: "56 Diamonds", gameId: mobileLegends.id, price: 15000, originalPrice: 17000, nominal: "56", sortOrder: 1 },
      { name: "172 Diamonds", gameId: mobileLegends.id, price: 45000, originalPrice: 50000, nominal: "172", bonus: "+10", sortOrder: 2 },
      { name: "568 Diamonds", gameId: mobileLegends.id, price: 145000, originalPrice: 155000, nominal: "568", bonus: "+50", sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  // Create products for Free Fire
  await prisma.product.createMany({
    data: [
      { name: "110 Diamonds", gameId: freeFire.id, price: 16000, originalPrice: 18000, nominal: "110", sortOrder: 1 },
      { name: "330 Diamonds", gameId: freeFire.id, price: 46000, originalPrice: 50000, nominal: "330", bonus: "+10", sortOrder: 2 },
    ],
    skipDuplicates: true,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
