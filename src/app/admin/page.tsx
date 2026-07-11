"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { ShoppingBag, Users, Gamepad2, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalGames: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: { email: string };
  items: { product: { name: string } }[];
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ totalRevenue: 0, totalOrders: 0, totalUsers: 0, totalGames: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
    ]).then(([statsData, ordersData]) => {
      if (statsData.data) setStats(statsData.data);
      if (ordersData.success) setOrders(ordersData.data.slice(0, 10));
    }).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total Pendapatan", value: formatRupiah(stats.totalRevenue), icon: TrendingUp, color: "bg-green-100 text-green-600" },
    { label: "Total Pesanan", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { label: "Total User", value: stats.totalUsers.toString(), icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Total Game", value: stats.totalGames.toString(), icon: Gamepad2, color: "bg-yellow-100 text-yellow-600" },
  ];

  const statusColors: Record<string, string> = {
    SUCCESS: "text-green-600 bg-green-100",
    PROCESSING: "text-yellow-600 bg-yellow-100",
    PENDING: "text-blue-600 bg-blue-100",
    FAILED: "text-red-600 bg-red-100",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Dashboard Admin</h1>
        <p className="mt-1 text-dark-500">Overview semua data dan aktivitas</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
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
        <CardTitle>Pesanan Terbaru</CardTitle>
        <CardContent className="mt-4">
          {loading ? (
            <div className="py-8 text-center text-dark-400">Memuat...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-dark-100">
                    <th className="pb-3 font-medium text-dark-500">No. Pesanan</th>
                    <th className="pb-3 font-medium text-dark-500">User</th>
                    <th className="pb-3 font-medium text-dark-500">Game</th>
                    <th className="pb-3 font-medium text-dark-500">Amount</th>
                    <th className="pb-3 font-medium text-dark-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-dark-400">Belum ada pesanan</td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-dark-50">
                        <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                        <td className="py-3">{order.user?.email}</td>
                        <td className="py-3">{order.items[0]?.product?.name || "-"}</td>
                        <td className="py-3 font-medium">{formatRupiah(order.totalAmount)}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] || "bg-dark-100"}`}>
                            {order.status}
                          </span>
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
    </div>
  );
}
