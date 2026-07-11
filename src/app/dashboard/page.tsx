import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { ShoppingBag, Wallet, Clock, User } from "lucide-react";
import Link from "next/link";
import { formatRupiah } from "@/lib/utils";

const stats = [
  { label: "Total Pesanan", value: "12", icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
  { label: "Total Pengeluaran", value: formatRupiah(485000), icon: Wallet, color: "bg-green-100 text-green-600" },
  { label: "Pesanan Aktif", value: "2", icon: Clock, color: "bg-yellow-100 text-yellow-600" },
];

const recentOrders = [
  { id: "GT-250711-ABC123", game: "Mobile Legends", amount: 15000, status: "SUCCESS", date: "11 Jul 2025" },
  { id: "GT-250710-DEF456", game: "Free Fire", amount: 46000, status: "PROCESSING", date: "10 Jul 2025" },
  { id: "GT-250709-GHI789", game: "Genshin Impact", amount: 16000, status: "SUCCESS", date: "9 Jul 2025" },
];

const statusColors: Record<string, string> = {
  SUCCESS: "text-green-600 bg-green-100",
  PROCESSING: "text-yellow-600 bg-yellow-100",
  PENDING: "text-blue-600 bg-blue-100",
  FAILED: "text-red-600 bg-red-100",
};

export default function DashboardPage() {
  return (
    <div className="container-page section-padding">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Dashboard</h1>
        <p className="mt-1 text-dark-500">Selamat datang kembali!</p>
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
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-dark-100 p-3"
              >
                <div>
                  <p className="font-mono text-sm font-medium text-dark-900">{order.id}</p>
                  <p className="text-xs text-dark-500">{order.game} &middot; {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-dark-900">{formatRupiah(order.amount)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
