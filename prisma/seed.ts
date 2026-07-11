import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { email: "admin@gametopup.id" },
    update: {},
    create: {
      name: "Admin GameTopup",
      email: "admin@gametopup.id",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const userPassword = await bcrypt.hash("user123", 12);
  await prisma.user.upsert({
    where: { email: "user@gametopup.id" },
    update: {},
    create: {
      name: "John Gamer",
      email: "user@gametopup.id",
      password: userPassword,
      role: "USER",
    },
  });

  const ml = await prisma.game.upsert({
    where: { slug: "mobile-legends" },
    update: {},
    create: {
      name: "Mobile Legends",
      slug: "mobile-legends",
      description: "Top up Diamond Mobile Legends dengan harga terbaik. Proses instan dan aman.",
      category: "MOBA",
      image: "/images/games/mobile-legends.jpg",
      sortOrder: 1,
    },
  });

  const ff = await prisma.game.upsert({
    where: { slug: "free-fire" },
    update: {},
    create: {
      name: "Free Fire",
      slug: "free-fire",
      description: "Top up Diamond Free Fire dengan proses instan. Harga paling murah!",
      category: "Battle Royale",
      image: "/images/games/free-fire.jpg",
      sortOrder: 2,
    },
  });

  const gi = await prisma.game.upsert({
    where: { slug: "genshin-impact" },
    update: {},
    create: {
      name: "Genshin Impact",
      slug: "genshin-impact",
      description: "Beli Genesis Crystal Genshin Impact murah dan cepat.",
      category: "RPG",
      image: "/images/games/genshin-impact.jpg",
      sortOrder: 3,
    },
  });

  const pubg = await prisma.game.upsert({
    where: { slug: "pubg-mobile" },
    update: {},
    create: {
      name: "PUBG Mobile",
      slug: "pubg-mobile",
      description: "Top up UC PUBG Mobile dengan harga terjangkau.",
      category: "Battle Royale",
      image: "/images/games/pubg-mobile.jpg",
      sortOrder: 4,
    },
  });

  const val = await prisma.game.upsert({
    where: { slug: "valorant" },
    update: {},
    create: {
      name: "Valorant",
      slug: "valorant",
      description: "Beli VP Valorant untuk skin dan battle pass favoritmu.",
      category: "FPS",
      image: "/images/games/valorant.jpg",
      sortOrder: 5,
    },
  });

  const roblox = await prisma.game.upsert({
    where: { slug: "roblox" },
    update: {},
    create: {
      name: "Roblox",
      slug: "roblox",
      description: "Beli Robux untuk berbagai item keren di Roblox.",
      category: "Sandbox",
      image: "/images/games/roblox.jpg",
      sortOrder: 6,
    },
  });

  const mlProducts = [
    { name: "56 Diamonds", price: 15000, originalPrice: 17000, nominal: "56", bonus: null, sortOrder: 1 },
    { name: "172 Diamonds", price: 45000, originalPrice: 50000, nominal: "172", bonus: "+10", sortOrder: 2 },
    { name: "298 Diamonds", price: 75000, originalPrice: 82000, nominal: "298", bonus: "+25", sortOrder: 3 },
    { name: "568 Diamonds", price: 145000, originalPrice: 155000, nominal: "568", bonus: "+50", sortOrder: 4 },
    { name: "878 Diamonds", price: 225000, originalPrice: 240000, nominal: "878", bonus: "+100", sortOrder: 5 },
    { name: "1688 Diamonds", price: 425000, originalPrice: 455000, nominal: "1688", bonus: "+200", sortOrder: 6 },
  ];

  const ffProducts = [
    { name: "110 Diamonds", price: 16000, originalPrice: 18000, nominal: "110", bonus: null, sortOrder: 1 },
    { name: "330 Diamonds", price: 46000, originalPrice: 50000, nominal: "330", bonus: "+10", sortOrder: 2 },
    { name: "560 Diamonds", price: 75000, originalPrice: 82000, nominal: "560", bonus: "+30", sortOrder: 3 },
    { name: "1160 Diamonds", price: 155000, originalPrice: 165000, nominal: "1160", bonus: "+100", sortOrder: 4 },
  ];

  const giProducts = [
    { name: "60 Genesis Crystal", price: 16000, originalPrice: null, nominal: "60", bonus: null, sortOrder: 1 },
    { name: "300 Genesis Crystal", price: 75000, originalPrice: null, nominal: "300", bonus: null, sortOrder: 2 },
    { name: "980 Genesis Crystal", price: 235000, originalPrice: null, nominal: "980", bonus: null, sortOrder: 3 },
  ];

  const pubgProducts = [
    { name: "60 UC", price: 15000, originalPrice: null, nominal: "60", bonus: null, sortOrder: 1 },
    { name: "300 + 25 UC", price: 75000, originalPrice: null, nominal: "300", bonus: "+25", sortOrder: 2 },
    { name: "600 + 60 UC", price: 145000, originalPrice: null, nominal: "600", bonus: "+60", sortOrder: 3 },
  ];

  const valProducts = [
    { name: "125 VP", price: 25000, originalPrice: null, nominal: "125", bonus: null, sortOrder: 1 },
    { name: "380 VP", price: 75000, originalPrice: null, nominal: "380", bonus: null, sortOrder: 2 },
    { name: "700 VP", price: 130000, originalPrice: null, nominal: "700", bonus: null, sortOrder: 3 },
  ];

  const robloxProducts = [
    { name: "80 Robux", price: 16000, originalPrice: null, nominal: "80", bonus: null, sortOrder: 1 },
    { name: "400 Robux", price: 75000, originalPrice: null, nominal: "400", bonus: null, sortOrder: 2 },
    { name: "800 Robux", price: 145000, originalPrice: null, nominal: "800", bonus: null, sortOrder: 3 },
  ];

  const allProducts = [
    ...mlProducts.map((p) => ({ ...p, gameId: ml.id })),
    ...ffProducts.map((p) => ({ ...p, gameId: ff.id })),
    ...giProducts.map((p) => ({ ...p, gameId: gi.id })),
    ...pubgProducts.map((p) => ({ ...p, gameId: pubg.id })),
    ...valProducts.map((p) => ({ ...p, gameId: val.id })),
    ...robloxProducts.map((p) => ({ ...p, gameId: roblox.id })),
  ];

  for (const product of allProducts) {
    const existing = await prisma.product.findFirst({
      where: { gameId: product.gameId, nominal: product.nominal },
    });
    if (!existing) {
      await prisma.product.create({ data: product });
    }
  }

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
