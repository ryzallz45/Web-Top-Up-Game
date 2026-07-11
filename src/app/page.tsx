import Link from "next/link";
import { Search, Zap, Shield, Clock, Star } from "lucide-react";
import GameGrid from "@/components/games/GameGrid";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Game } from "@/types";

const mockGames: Game[] = [
  {
    id: "1",
    name: "Mobile Legends",
    slug: "mobile-legends",
    description: "Top up Diamond Mobile Legends dengan harga terbaik",
    image: null,
    category: "MOBA",
    isActive: true,
    sortOrder: 1,
    products: [
      { id: "p1", name: "56 Diamonds", description: "", price: 15000, originalPrice: 17000, nominal: "56", bonus: null, isActive: true, sortOrder: 1, gameId: "1" },
      { id: "p2", name: "172 Diamonds", description: "", price: 45000, originalPrice: 50000, nominal: "172", bonus: "+10", isActive: true, sortOrder: 2, gameId: "1" },
      { id: "p3", name: "568 Diamonds", description: "", price: 145000, originalPrice: 155000, nominal: "568", bonus: "+50", isActive: true, sortOrder: 3, gameId: "1" },
    ],
  },
  {
    id: "2",
    name: "Free Fire",
    slug: "free-fire",
    description: "Top up Diamond Free Fire dengan proses instan",
    image: null,
    category: "Battle Royale",
    isActive: true,
    sortOrder: 2,
    products: [
      { id: "p4", name: "110 Diamonds", description: "", price: 16000, originalPrice: 18000, nominal: "110", bonus: null, isActive: true, sortOrder: 1, gameId: "2" },
      { id: "p5", name: "330 Diamonds", description: "", price: 46000, originalPrice: 50000, nominal: "330", bonus: "+10", isActive: true, sortOrder: 2, gameId: "2" },
    ],
  },
  {
    id: "3",
    name: "Genshin Impact",
    slug: "genshin-impact",
    description: "Beli Genesis Crystal Genshin Impact murah",
    image: null,
    category: "RPG",
    isActive: true,
    sortOrder: 3,
    products: [
      { id: "p6", name: "60 Genesis Crystal", description: "", price: 16000, originalPrice: null, nominal: "60", bonus: null, isActive: true, sortOrder: 1, gameId: "3" },
    ],
  },
  {
    id: "4",
    name: "PUBG Mobile",
    slug: "pubg-mobile",
    description: "Top up UC PUBG Mobile dengan harga terjangkau",
    image: null,
    category: "Battle Royale",
    isActive: true,
    sortOrder: 4,
    products: [
      { id: "p7", name: "60 UC", description: "", price: 15000, originalPrice: null, nominal: "60", bonus: null, isActive: true, sortOrder: 1, gameId: "4" },
    ],
  },
  {
    id: "5",
    name: "Valorant",
    slug: "valorant",
    description: "Beli VP Valorant untuk skin favoritmu",
    image: null,
    category: "FPS",
    isActive: true,
    sortOrder: 5,
    products: [
      { id: "p8", name: "125 VP", description: "", price: 25000, originalPrice: null, nominal: "125", bonus: null, isActive: true, sortOrder: 1, gameId: "5" },
    ],
  },
  {
    id: "6",
    name: "Roblox",
    slug: "roblox",
    description: "Beli Robux untuk berbagai item keren",
    image: null,
    category: "Sandbox",
    isActive: true,
    sortOrder: 6,
    products: [
      { id: "p9", name: "80 Robux", description: "", price: 16000, originalPrice: null, nominal: "80", bonus: null, isActive: true, sortOrder: 1, gameId: "6" },
    ],
  },
];

const features = [
  { icon: Zap, title: "Proses Instan", description: "Pesanan otomatis diproses dalam hitungan detik" },
  { icon: Shield, title: "100% Aman", description: "Transaksi terjamin aman dan terpercaya" },
  { icon: Clock, title: "24/7 Online", description: "Layanan tersedia kapan saja dan di mana saja" },
  { icon: Star, title: "Harga Terbaik", description: "Harga paling murah dibanding kompetitor" },
];

export default function HomePage() {
  return (
    <div>
      <section className="gradient-hero relative overflow-hidden">
        <div className="container-page section-padding relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Top Up Game{" "}
              <span className="text-primary-300">Mudah & Cepat</span>
            </h1>
            <p className="mt-6 text-lg text-primary-100">
              Platform terpercaya untuk top up semua game favoritmu. Proses instan,
              harga terbaik, dan 100% aman.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/games">
                <Button size="lg" className="min-w-[200px] bg-white text-primary-600 hover:bg-primary-50">
                  Mulai Top Up
                </Button>
              </Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  placeholder="Cari game favoritmu..."
                  className="h-12 w-full rounded-xl border-0 bg-white/10 pl-10 pr-4 text-white placeholder-primary-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 sm:w-80"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-0 right-0 h-16 bg-dark-50" />
      </section>

      <section className="section-padding container-page">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                <feature.icon className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-dark-900">{feature.title}</h3>
              <p className="mt-1 text-xs text-dark-500">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-padding container-page">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-dark-900">Game Populer</h2>
          <p className="mt-2 text-dark-500">Pilih game favoritmu dan mulai top up</p>
        </div>
        <GameGrid games={mockGames} />
        <div className="mt-8 text-center">
          <Link href="/games">
            <Button variant="outline">Lihat Semua Game</Button>
          </Link>
        </div>
      </section>

      <section className="section-padding container-page">
        <Card className="gradient-hero text-center">
          <h2 className="text-2xl font-bold text-white">Siap untuk Top Up?</h2>
          <p className="mt-2 text-primary-100">
            Bergabung dengan ribuan gamer yang sudah mempercayai GameTopup
          </p>
          <div className="mt-6">
            <Link href="/games">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                Top Up Sekarang
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
