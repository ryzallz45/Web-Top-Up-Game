import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";

const orders = [
  { id: "GT-250711-ABC123", user: "john@email.com", game: "Mobile Legends", nominal: "56 Diamonds", amount: 15000, status: "SUCCESS", date: "11 Jul 2025, 14:30" },
  { id: "GT-250711-XYZ789", user: "sarah@email.com", game: "Free Fire", nominal: "330 Diamonds", amount: 46000, status: "PROCESSING", date: "11 Jul 2025, 14:15" },
  { id: "GT-250711-QWE456", user: "budi@email.com", game: "Genshin Impact", nominal: "60 Crystal", amount: 16000, status: "PENDING", date: "11 Jul 2025, 13:50" },
  { id: "GT-250710-DEF456", user: "ani@email.com", game: "Mobile Legends", nominal: "172 Diamonds", amount: 45000, status: "FAILED", date: "10 Jul 2025, 09:15" },
  { id: "GT-250709-GHI789", user: "dina@email.com", game: "PUBG Mobile", nominal: "60 UC", amount: 15000, status: "SUCCESS", date: "9 Jul 2025, 20:45" },
];

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  SUCCESS: { label: "Berhasil", variant: "success" },
  PROCESSING: { label: "Diproses", variant: "warning" },
  PENDING: { label: "Menunggu", variant: "info" },
  FAILED: { label: "Gagal", variant: "danger" },
  CANCELLED: { label: "Dibatalkan", variant: "default" },
};

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Kelola Pesanan</h1>
        <p className="mt-1 text-dark-500">Monitor dan kelola semua pesanan</p>
      </div>

      <div className="mb-4 flex gap-2">
        <Button variant="outline" size="sm">Semua</Button>
        <Button variant="ghost" size="sm">Menunggu</Button>
        <Button variant="ghost" size="sm">Diproses</Button>
        <Button variant="ghost" size="sm">Berhasil</Button>
        <Button variant="ghost" size="sm">Gagal</Button>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="pb-3 font-medium text-dark-500">No. Pesanan</th>
                  <th className="pb-3 font-medium text-dark-500">User</th>
                  <th className="pb-3 font-medium text-dark-500">Game</th>
                  <th className="pb-3 font-medium text-dark-500">Nominal</th>
                  <th className="pb-3 font-medium text-dark-500">Amount</th>
                  <th className="pb-3 font-medium text-dark-500">Status</th>
                  <th className="pb-3 font-medium text-dark-500">Tanggal</th>
                  <th className="pb-3 font-medium text-dark-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-dark-50">
                    <td className="py-3 font-mono text-xs">{order.id}</td>
                    <td className="py-3">{order.user}</td>
                    <td className="py-3">{order.game}</td>
                    <td className="py-3">{order.nominal}</td>
                    <td className="py-3 font-medium">{formatRupiah(order.amount)}</td>
                    <td className="py-3">
                      <Badge variant={statusBadge[order.status].variant}>
                        {statusBadge[order.status].label}
                      </Badge>
                    </td>
                    <td className="py-3 text-dark-500">{order.date}</td>
                    <td className="py-3">
                      <Button variant="ghost" size="sm">Detail</Button>
                    </td>
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
