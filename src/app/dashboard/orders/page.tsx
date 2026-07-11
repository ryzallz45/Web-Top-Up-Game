"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: { product: { name: string; nominal: string }; price: number }[];
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

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page section-padding">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Riwayat Pesanan</h1>
        <p className="mt-1 text-dark-500">Semua pesanan top-up kamu</p>
      </div>

      <Card>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-dark-400">Memuat pesanan...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-dark-400">Belum ada pesanan</div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const badge = statusBadge[order.status] || { label: order.status, variant: "default" as const };
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-lg border border-dark-100 p-4 transition-colors hover:bg-dark-50"
                  >
                    <div>
                      <p className="font-mono text-sm font-medium text-dark-900">{order.orderNumber}</p>
                      <p className="text-sm text-dark-600">
                        {order.items[0]?.product?.name || "Top Up"} - {order.items[0]?.product?.nominal || ""}
                      </p>
                      <p className="mt-1 text-xs text-dark-400">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-dark-900">{formatRupiah(order.totalAmount)}</p>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
