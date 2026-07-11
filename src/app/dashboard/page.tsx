"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { ShoppingBag, Wallet, Clock, User } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  gameAccountId: string;
  createdAt: string;
  items: { product: { name: string; nominal: string }; price: number }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setOrders(data.data.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const totalSpent = orders
    .filter((o) => o.status === "SUCCESS")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PROCESSING").length;

  const stats = [
    { label: "Total Pesanan", value: orders.length.toString(), icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { label: "Total Pengeluaran", value: formatRupiah(totalSpent), icon: Wallet, color: "bg-green-100 text-green-600" },
    { label: "Pesanan Aktif", value: activeOrders.toString(), icon: Clock, color: "bg-yellow-100 text-yellow-600" },
  ];

  const statusColors: Record<string, string> = {
    SUCCESS: "text-green-600 bg-green-100",
    PROCESSING: "text-yellow-600 bg-yellow-100",
    PENDING: "text-blue-600 bg-blue-100",
    FAILED: "text-red-600 bg-red-100",
    CANCELLED: "text-dark-400 bg-dark-100",
    EXPIRED: "text-dark-400 bg-dark-100",
  };

  return (
    <div className="container-page section-padding">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">
          Dashboard
        </h1>
        <p className="mt-1 text-dark-500">
          Selamat datang, {session?.user?.name || "User"}!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-dark-500">{stat.label}</p>
                <p className="text-xl font-bold text-dark-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <CardTitle>Riwayat Pesanan Terbaru</CardTitle>
          <Link href="/dashboard/orders" className="text-sm font-medium text-primary-600 hover:underline">
            Lihat Semua
          </Link>
        </div>
        <CardContent className="mt-4">
          {loading ? (
            <div className="py-8 text-center text-dark-400">Memuat...</div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center text-dark-400">Belum ada pesanan</div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/checkout/${order.id}`}
                  className="flex items-center justify-between rounded-lg border border-dark-100 p-3 hover:bg-dark-50"
                >
                  <div>
                    <p className="font-mono text-sm font-medium text-dark-900">{order.orderNumber}</p>
                    <p className="text-xs text-dark-500">
                      {order.items[0]?.product?.name || "Top Up"} &middot;{" "}
                      {new Date(order.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-dark-900">{formatRupiah(order.totalAmount)}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || "bg-dark-100 text-dark-500"}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/orders">
          <Card hover>
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-dark-900">Riwayat Pesanan</span>
            </div>
          </Card>
        </Link>
        <Link href="/dashboard/profile">
          <Card hover>
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-dark-900">Profil Saya</span>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
