"use client";

import { useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Plus, Edit, Trash2 } from "lucide-react";

const mockGames = [
  { id: "1", name: "Mobile Legends", slug: "mobile-legends", category: "MOBA", isActive: true, products: 5 },
  { id: "2", name: "Free Fire", slug: "free-fire", category: "Battle Royale", isActive: true, products: 4 },
  { id: "3", name: "Genshin Impact", slug: "genshin-impact", category: "RPG", isActive: true, products: 3 },
  { id: "4", name: "PUBG Mobile", slug: "pubg-mobile", category: "Battle Royale", isActive: true, products: 3 },
  { id: "5", name: "Valorant", slug: "valorant", category: "FPS", isActive: false, products: 2 },
];

export default function AdminGamesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "", slug: "" });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Kelola Game</h1>
          <p className="mt-1 text-dark-500">Tambah, edit, atau hapus game</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Game
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="pb-3 font-medium text-dark-500">Nama Game</th>
                  <th className="pb-3 font-medium text-dark-500">Kategori</th>
                  <th className="pb-3 font-medium text-dark-500">Produk</th>
                  <th className="pb-3 font-medium text-dark-500">Status</th>
                  <th className="pb-3 font-medium text-dark-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50">
                {mockGames.map((game) => (
                  <tr key={game.id} className="hover:bg-dark-50">
                    <td className="py-3 font-medium text-dark-900">{game.name}</td>
                    <td className="py-3">{game.category}</td>
                    <td className="py-3">{game.products} produk</td>
                    <td className="py-3">
                      <Badge variant={game.isActive ? "success" : "default"}>
                        {game.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Game Baru">
        <div className="space-y-4">
          <Input
            label="Nama Game"
            placeholder="Contoh: Mobile Legends"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Slug"
            placeholder="Contoh: mobile-legends"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
          <Input
            label="Kategori"
            placeholder="Contoh: MOBA"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={() => setIsModalOpen(false)}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
