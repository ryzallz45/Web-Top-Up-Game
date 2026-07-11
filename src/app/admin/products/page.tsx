"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number | null;
  nominal: string;
  bonus: string | null;
  isActive: boolean;
  game: { name: string };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", gameId: "", price: "", originalPrice: "", nominal: "", bonus: "",
  });

  const fetchProducts = () => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => { if (data.success) setProducts(data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    fetch("/api/admin/games").then((r) => r.json()).then((data) => {
      if (data.success) setGames(data.data);
    });
  }, []);

  const handleSave = async () => {
    await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        price: parseInt(formData.price),
        originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
      }),
    });
    setIsModalOpen(false);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin hapus produk ini?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Kelola Produk</h1>
          <p className="mt-1 text-dark-500">Kelola semua produk top-up</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Produk
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
                    <th className="pb-3 font-medium text-dark-500">Nama</th>
                    <th className="pb-3 font-medium text-dark-500">Game</th>
                    <th className="pb-3 font-medium text-dark-500">Nominal</th>
                    <th className="pb-3 font-medium text-dark-500">Harga</th>
                    <th className="pb-3 font-medium text-dark-500">Bonus</th>
                    <th className="pb-3 font-medium text-dark-500">Status</th>
                    <th className="pb-3 font-medium text-dark-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {products.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-dark-400">Belum ada produk</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="hover:bg-dark-50">
                        <td className="py-3 font-medium text-dark-900">{product.name}</td>
                        <td className="py-3">{product.game?.name}</td>
                        <td className="py-3">{product.nominal}</td>
                        <td className="py-3 font-medium">{formatRupiah(product.price)}</td>
                        <td className="py-3 text-green-600">{product.bonus || "-"}</td>
                        <td className="py-3">
                          <Badge variant={product.isActive ? "success" : "default"}>
                            {product.isActive ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(product.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Produk Baru">
        <div className="space-y-4">
          <Input label="Nama Produk" placeholder="Contoh: 56 Diamonds" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark-700">Game</label>
            <select
              value={formData.gameId}
              onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
              className="flex h-10 w-full rounded-lg border border-dark-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Pilih game</option>
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <Input label="Nominal" placeholder="Contoh: 56" value={formData.nominal} onChange={(e) => setFormData({ ...formData, nominal: e.target.value })} />
          <Input label="Harga (Rp)" type="number" placeholder="Contoh: 15000" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
          <Input label="Harga Asli (Rp, opsional)" type="number" placeholder="Harga sebelum diskon" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
          <Input label="Bonus (opsional)" placeholder="Contoh: +10" value={formData.bonus} onChange={(e) => setFormData({ ...formData, bonus: e.target.value })} />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
