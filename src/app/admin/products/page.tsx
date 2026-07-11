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
  description: string | null;
  isActive: boolean;
  game: { id: string; name: string };
}

interface Game {
  id: string;
  name: string;
}

const emptyForm = { name: "", gameId: "", price: "", originalPrice: "", nominal: "", bonus: "", description: "" };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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

  const openCreate = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      gameId: product.game.id,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      nominal: product.nominal,
      bonus: product.bonus || "",
      description: product.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            price: parseInt(formData.price),
            originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
            nominal: formData.nominal,
            bonus: formData.bonus || null,
            description: formData.description || null,
          }),
        });
        const data = await res.json();
        if (!data.success) alert(data.error);
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            gameId: formData.gameId,
            price: parseInt(formData.price),
            originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : null,
            nominal: formData.nominal,
            bonus: formData.bonus || null,
          }),
        });
        const data = await res.json();
        if (!data.success) alert(data.error);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch {
      alert("Gagal menyimpan produk");
    } finally {
      setSaving(false);
    }
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
        <Button onClick={openCreate}>
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
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => openEdit(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
      >
        <div className="space-y-4">
          <Input
            label="Nama Produk"
            placeholder="Contoh: 56 Diamonds"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          {!editingProduct && (
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
          )}
          {editingProduct && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-dark-700">Game</label>
              <p className="text-sm text-dark-600">{editingProduct.game.name}</p>
            </div>
          )}
          <Input
            label="Nominal"
            placeholder="Contoh: 56"
            value={formData.nominal}
            onChange={(e) => setFormData({ ...formData, nominal: e.target.value })}
          />
          <Input
            label="Harga (Rp)"
            type="number"
            placeholder="Contoh: 15000"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <Input
            label="Harga Asli (Rp, opsional)"
            type="number"
            placeholder="Harga sebelum diskon"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
          />
          <Input
            label="Bonus (opsional)"
            placeholder="Contoh: +10"
            value={formData.bonus}
            onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={handleSave} isLoading={saving}>
              {editingProduct ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
