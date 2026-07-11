import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";

const orders = [
  { id: "GT-250711-ABC123", game: "Mobile Legends", nominal: "56 Diamonds", amount: 15000, status: "SUCCESS" as const, date: "11 Jul 2025, 14:30" },
  { id: "GT-250710-DEF456", game: "Free Fire", nominal: "330 Diamonds", amount: 46000, status: "PROCESSING" as const, date: "10 Jul 2025, 09:15" },
  { id: "GT-250709-GHI789", game: "Genshin Impact", nominal: "60 Genesis Crystal", amount: 16000, status: "SUCCESS" as const, date: "9 Jul 2025, 20:45" },
  { id: "GT-250708-JKL012", game: "Mobile Legends", nominal: "172 Diamonds", amount: 45000, status: "FAILED" as const, date: "8 Jul 2025, 11:20" },
  { id: "GT-250707-MNO345", game: "PUBG Mobile", nominal: "60 UC", amount: 15000, status: "SUCCESS" as const, date: "7 Jul 2025, 16:00" },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  SUCCESS: { label: "Berhasil", variant: "success" },
  PROCESSING: { label: "Diproses", variant: "warning" },
  PENDING: { label: "Menunggu", variant: "info" },
  FAILED: { label: "Gagal", variant: "danger" },
  CANCELLED: { label: "Dibatalkan", variant: "default" },
};

export default function OrdersPage() {
  return (
    <div className="container-page section-padding">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Riwayat Pesanan</h1>
        <p className="mt-1 text-dark-500">Semua pesanan top-up kamu</p>
      </div>

      <Card>
        <CardContent>
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border border-dark-100 p-4 transition-colors hover:bg-dark-50"
              >
                <div>
                  <p className="font-mono text-sm font-medium text-dark-900">{order.id}</p>
                  <p className="text-sm text-dark-600">{order.game} - {order.nominal}</p>
                  <p className="mt-1 text-xs text-dark-400">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-dark-900">{formatRupiah(order.amount)}</p>
                  <Badge variant={statusBadge[order.status].variant}>
                    {statusBadge[order.status].label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
