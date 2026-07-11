"use client";

import { useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Plus, Edit, Trash2 } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const mockProducts = [
  { id: "1", name: "56 Diamonds", game: "Mobile Legends", price: 15000, nominal: "56", isActive: true },
  { id: "2", name: "172 Diamonds", game: "Mobile Legends", price: 45000, nominal: "172", isActive: true },
  { id: "3", name: "110 Diamonds", game: "Free Fire", price: 16000, nominal: "110", isActive: true },
  { id: "4", name: "330 Diamonds", game: "Free Fire", price: 46000, nominal: "330", isActive: true },
  { id: "5", name: "60 Genesis Crystal", game: "Genshin Impact", price: 16000, nominal: "60", isActive: false },
];

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="pb-3 font-medium text-dark-500">Nama Produk</th>
                  <th className="pb-3 font-medium text-dark-500">Game</th>
                  <th className="pb-3 font-medium text-dark-500">Nominal</th>
                  <th className="pb-3 font-medium text-dark-500">Harga</th>
                  <th className="pb-3 font-medium text-dark-500">Status</th>
                  <th className="pb-3 font-medium text-dark-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50">
                {mockProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-dark-50">
                    <td className="py-3 font-medium text-dark-900">{product.name}</td>
                    <td className="py-3">{product.game}</td>
                    <td className="py-3">{product.nominal}</td>
                    <td className="py-3 font-medium">{formatRupiah(product.price)}</td>
                    <td className="py-3">
                      <Badge variant={product.isActive ? "success" : "default"}>
                        {product.isActive ? "Aktif" : "Nonaktif"}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Produk Baru">
        <div className="space-y-4">
          <Input label="Nama Produk" placeholder="Contoh: 56 Diamonds" />
          <Input label="Game" placeholder="Pilih game" />
          <Input label="Nominal" placeholder="Contoh: 56" />
          <Input label="Harga (Rp)" type="number" placeholder="Contoh: 15000" />
          <Input label="Bonus (opsional)" placeholder="Contoh: +10" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
            <Button onClick={() => setIsModalOpen(false)}>Simpan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
