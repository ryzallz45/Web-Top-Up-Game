import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import GamesFilter from "@/components/games/GamesFilter";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const where: Record<string, unknown> = { isActive: true };

  if (searchParams.category && searchParams.category !== "Semua") {
    where.category = searchParams.category;
  }

  if (searchParams.search) {
    where.name = { contains: searchParams.search };
  }

  const games = await prisma.game.findMany({
    where,
    include: {
      products: { where: { isActive: true }, orderBy: { price: "asc" } },
    },
    orderBy: { sortOrder: "asc" },
  });

  const categories = ["Semua", "MOBA", "Battle Royale", "RPG", "FPS", "Sandbox"];

  return (
    <div className="container-page section-padding">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">Semua Game</h1>
        <p className="mt-2 text-dark-500">Pilih game dan mulai top up sekarang</p>
      </div>

      <GamesFilter categories={categories} />

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <span className="text-6xl">🎮</span>
          <h3 className="mt-4 text-lg font-medium text-dark-900">Tidak ada game ditemukan</h3>
          <p className="mt-1 text-sm text-dark-500">Coba pencarian dengan kata kunci lain</p>
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
    </div>
  );
}
