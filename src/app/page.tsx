import Link from "next/link";
import { Search, Zap, Shield, Clock, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import prisma from "@/lib/prisma";

async function getGames() {
  const games = await prisma.game.findMany({
    where: { isActive: true },
    include: { products: { where: { isActive: true }, orderBy: { price: "asc" } } },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
  return games;
}

export default async function HomePage() {
  const games = await getGames();

  const features = [
    { icon: Zap, title: "Proses Instan", description: "Pesanan otomatis diproses dalam hitungan detik" },
    { icon: Shield, title: "100% Aman", description: "Transaksi terjamin aman dan terpercaya" },
    { icon: Clock, title: "24/7 Online", description: "Layanan tersedia kapan saja dan di mana saja" },
    { icon: Star, title: "Harga Terbaik", description: "Harga paling murah dibanding kompetitor" },
  ];

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
                <Link href="/games">
                  <input
                    type="text"
                    placeholder="Cari game favoritmu..."
                    className="h-12 w-full rounded-xl border-0 bg-white/10 pl-10 pr-4 text-white placeholder-primary-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30 sm:w-80"
                    readOnly
                  />
                </Link>
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
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-6xl">🎮</span>
            <h3 className="mt-4 text-lg font-medium text-dark-900">Belum ada game</h3>
            <p className="mt-1 text-sm text-dark-500">Game akan segera tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {games.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <Card hover className="group overflow-hidden p-0">
                  <div className="relative aspect-video w-full overflow-hidden bg-dark-100">
                    <div className="flex h-full items-center justify-center text-dark-400">
                      <span className="text-4xl">🎮</span>
                    </div>
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-primary-600 px-2.5 py-1 text-xs font-medium text-white">
                        {game.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-semibold text-dark-900 group-hover:text-primary-600">
                      {game.name}
                    </h3>
                    {game.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-dark-500">{game.description}</p>
                    )}
                    {game.products.length > 0 && (
                      <p className="mt-2 text-xs text-dark-400">
                        Mulai dari Rp{Math.min(...game.products.map((p) => p.price)).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
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
