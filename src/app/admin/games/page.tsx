"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Plus, Edit, Trash2 } from "lucide-react";

interface Game {
  id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
  _count: { products: number };
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({ name: "", category: "", slug: "", description: "" });

  const fetchGames = () => {
    fetch("/api/admin/games")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setGames(data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchGames(); }, []);

  const openCreate = () => {
    setEditingGame(null);
    setFormData({ name: "", category: "", slug: "", description: "" });
    setIsModalOpen(true);
  };

  const openEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({ name: game.name, category: game.category, slug: game.slug, description: "" });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    const url = editingGame ? `/api/admin/games/${editingGame.id}` : "/api/admin/games";
    const method = editingGame ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setIsModalOpen(false);
    fetchGames();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus game ini?")) return;
    await fetch(`/api/admin/games/${id}`, { method: "DELETE" });
    fetchGames();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Kelola Game</h1>
          <p className="mt-1 text-dark-500">Tambah, edit, atau hapus game</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Game
        </Button>
      </div>

      <Card>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-dark-400">Memuat...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-dark-100">
                    <th className="pb-3 font-medium text-dark-500">Nama Game</th>
                    <th className="pb-3 font-medium text-dark-500">Slug</th>
                    <th className="pb-3 font-medium text-dark-500">Kategori</th>
                    <th className="pb-3 font-medium text-dark-500">Produk</th>
                    <th className="pb-3 font-medium text-dark-500">Status</th>
                    <th className="pb-3 font-medium text-dark-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {games.map((game) => (
                    <tr key={game.id} className="hover:bg-dark-50">
                      <td className="py-3 font-medium text-dark-900">{game.name}</td>
                      <td className="py-3 text-dark-500">{game.slug}</td>
                      <td className="py-3">{game.category}</td>
                      <td className="py-3">{game._count.products} produk</td>
                      <td className="py-3">
                        <Badge variant={game.isActive ? "success" : "default"}>
                          {game.isActive ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEdit(game)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(game.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGame ? "Edit Game" : "Tambah Game Baru"}
      >
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
          <Input
            label="Deskripsi"
            placeholder="Deskripsi singkat game"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
