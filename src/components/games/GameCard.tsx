import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import type { Game } from "@/types";

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link href={`/games/${game.slug}`}>
      <Card hover className="group overflow-hidden p-0">
        <div className="relative aspect-video w-full overflow-hidden bg-dark-100">
          {game.image ? (
            <Image
              src={game.image}
              alt={game.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-dark-400">
              <span className="text-4xl">🎮</span>
            </div>
          )}
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
            <p className="mt-1 line-clamp-2 text-sm text-dark-500">
              {game.description}
            </p>
          )}
          {game.products && game.products.length > 0 && (
            <p className="mt-2 text-xs text-dark-400">
              Mulai dari Rp{Math.min(...game.products.map((p) => p.price)).toLocaleString("id-ID")}
            </p>
          )}
        </div>
      </Card>
    </Link>
  );
}
