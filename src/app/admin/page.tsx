import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { ShoppingBag, Users, Gamepad2, TrendingUp } from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const stats = [
  { label: "Total Pendapatan", value: formatRupiah(12500000), icon: TrendingUp, color: "bg-green-100 text-green-600" },
  { label: "Total Pesanan", value: "156", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
  { label: "Total User", value: "89", icon: Users, color: "bg-purple-100 text-purple-600" },
  { label: "Total Game", value: "12", icon: Gamepad2, color: "bg-yellow-100 text-yellow-600" },
];

const recentOrders = [
  { id: "GT-250711-ABC123", user: "john@email.com", game: "Mobile Legends", amount: 15000, status: "SUCCESS", date: "14:30" },
  { id: "GT-250711-XYZ789", user: "sarah@email.com", game: "Free Fire", amount: 46000, status: "PROCESSING", date: "14:15" },
  { id: "GT-250711-QWE456", user: "budi@email.com", game: "Genshin Impact", amount: 16000, status: "PENDING", date: "13:50" },
];

const statusColors: Record<string, string> = {
  SUCCESS: "text-green-600 bg-green-100",
  PROCESSING: "text-yellow-600 bg-yellow-100",
  PENDING: "text-blue-600 bg-blue-100",
  FAILED: "text-red-600 bg-red-100",
};

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Dashboard Admin</h1>
        <p className="mt-1 text-dark-500">Overview semua data dan aktivitas</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
        <CardTitle>Pesanan Terbaru</CardTitle>
        <CardContent className="mt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="pb-3 font-medium text-dark-500">No. Pesanan</th>
                  <th className="pb-3 font-medium text-dark-500">User</th>
                  <th className="pb-3 font-medium text-dark-500">Game</th>
                  <th className="pb-3 font-medium text-dark-500">Amount</th>
                  <th className="pb-3 font-medium text-dark-500">Status</th>
                  <th className="pb-3 font-medium text-dark-500">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-50">
                    <td className="py-3 font-mono text-xs">{order.id}</td>
                    <td className="py-3">{order.user}</td>
                    <td className="py-3">{order.game}</td>
                    <td className="py-3 font-medium">{formatRupiah(order.amount)}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-dark-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
