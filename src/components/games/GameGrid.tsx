import GameCard from "./GameCard";
import type { Game } from "@/types";

interface GameGridProps {
  games: Game[];
}

export default function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <span className="text-6xl">🎮</span>
        <h3 className="mt-4 text-lg font-medium text-dark-900">Tidak ada game ditemukan</h3>
        <p className="mt-1 text-sm text-dark-500">Coba pencarian dengan kata kunci lain</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
