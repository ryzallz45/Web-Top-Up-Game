"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import GameGrid from "@/components/games/GameGrid";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { Game } from "@/types";

const mockGames: Game[] = [
  { id: "1", name: "Mobile Legends", slug: "mobile-legends", description: "Top up Diamond ML", image: null, category: "MOBA", isActive: true, sortOrder: 1, products: [{ id: "p1", name: "56 Diamonds", description: "", price: 15000, originalPrice: 17000, nominal: "56", bonus: null, isActive: true, sortOrder: 1, gameId: "1" }] },
  { id: "2", name: "Free Fire", slug: "free-fire", description: "Top up Diamond FF", image: null, category: "Battle Royale", isActive: true, sortOrder: 2, products: [{ id: "p4", name: "110 Diamonds", description: "", price: 16000, originalPrice: null, nominal: "110", bonus: null, isActive: true, sortOrder: 1, gameId: "2" }] },
  { id: "3", name: "Genshin Impact", slug: "genshin-impact", description: "Beli Genesis Crystal", image: null, category: "RPG", isActive: true, sortOrder: 3, products: [{ id: "p6", name: "60 Crystal", description: "", price: 16000, originalPrice: null, nominal: "60", bonus: null, isActive: true, sortOrder: 1, gameId: "3" }] },
  { id: "4", name: "PUBG Mobile", slug: "pubg-mobile", description: "Top up UC PUBG", image: null, category: "Battle Royale", isActive: true, sortOrder: 4, products: [{ id: "p7", name: "60 UC", description: "", price: 15000, originalPrice: null, nominal: "60", bonus: null, isActive: true, sortOrder: 1, gameId: "4" }] },
  { id: "5", name: "Valorant", slug: "valorant", description: "Beli VP Valorant", image: null, category: "FPS", isActive: true, sortOrder: 5, products: [{ id: "p8", name: "125 VP", description: "", price: 25000, originalPrice: null, nominal: "125", bonus: null, isActive: true, sortOrder: 1, gameId: "5" }] },
  { id: "6", name: "Roblox", slug: "roblox", description: "Beli Robux", image: null, category: "Sandbox", isActive: true, sortOrder: 6, products: [{ id: "p9", name: "80 Robux", description: "", price: 16000, originalPrice: null, nominal: "80", bonus: null, isActive: true, sortOrder: 1, gameId: "6" }] },
];

const categories = ["Semua", "MOBA", "Battle Royale", "RPG", "FPS", "Sandbox"];

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");

  const filteredGames = mockGames.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Semua" || game.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container-page section-padding">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">Semua Game</h1>
        <p className="mt-2 text-dark-500">Pilih game dan mulai top up sekarang</p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            placeholder="Cari game..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-dark-300 bg-white pl-10 pr-4 text-sm placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === category
                ? "bg-primary-600 text-white"
                : "bg-dark-100 text-dark-600 hover:bg-dark-200"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <GameGrid games={filteredGames} />
    </div>
  );
}
