"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: { email: string; name: string };
  items: { product: { name: string; nominal: string } }[];
  payment: { method: string; status: string } | null;
}

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  SUCCESS: { label: "Berhasil", variant: "success" },
  PROCESSING: { label: "Diproses", variant: "warning" },
  PENDING: { label: "Menunggu", variant: "info" },
  FAILED: { label: "Gagal", variant: "danger" },
  CANCELLED: { label: "Dibatalkan", variant: "default" },
  EXPIRED: { label: "Kedaluwarsa", variant: "default" },
};

const filters = ["Semua", "PENDING", "PROCESSING", "SUCCESS", "FAILED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { if (data.success) setOrders(data.data); })
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = activeFilter === "Semua"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Kelola Pesanan</h1>
        <p className="mt-1 text-dark-500">Monitor dan kelola semua pesanan</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            variant={activeFilter === f ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter(f)}
          >
            {f === "Semua" ? f : (statusBadge[f]?.label || f)}
          </Button>
        ))}
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
                    <th className="pb-3 font-medium text-dark-500">No. Pesanan</th>
                    <th className="pb-3 font-medium text-dark-500">User</th>
                    <th className="pb-3 font-medium text-dark-500">Produk</th>
                    <th className="pb-3 font-medium text-dark-500">Amount</th>
                    <th className="pb-3 font-medium text-dark-500">Status</th>
                    <th className="pb-3 font-medium text-dark-500">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={6} className="py-8 text-center text-dark-400">Tidak ada pesanan</td></tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const badge = statusBadge[order.status] || { label: order.status, variant: "default" as const };
                      return (
                        <tr key={order.id} className="hover:bg-dark-50">
                          <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                          <td className="py-3">{order.user?.name || order.user?.email}</td>
                          <td className="py-3">{order.items[0]?.product?.name || "-"}</td>
                          <td className="py-3 font-medium">{formatRupiah(order.totalAmount)}</td>
                          <td className="py-3"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                          <td className="py-3 text-dark-500">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
