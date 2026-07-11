import { Card, CardTitle } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function OrderDetailPage() {
  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-2xl">
        <Link href="/dashboard/orders" className="mb-6 inline-block text-sm text-dark-500 hover:text-dark-700">
          &larr; Kembali ke Riwayat Pesanan
        </Link>

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Pesanan</CardTitle>
            <Badge variant="warning">Menunggu Pembayaran</Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-dark-500">No. Pesanan</p>
                <p className="font-mono text-sm font-medium text-dark-900">GT-250711-ABC123</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Tanggal</p>
                <p className="text-sm font-medium text-dark-900">11 Juli 2025, 14:30</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Game</p>
                <p className="text-sm font-medium text-dark-900">Mobile Legends</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Nominal</p>
                <p className="text-sm font-medium text-dark-900">56 Diamonds</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">ID Akun</p>
                <p className="text-sm font-medium text-dark-900">12345678</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Server</p>
                <p className="text-sm font-medium text-dark-900">2067</p>
              </div>
            </div>

            <div className="border-t border-dark-100 pt-4">
              <div className="flex justify-between">
                <span className="font-medium text-dark-700">Total Pembayaran</span>
                <span className="text-xl font-bold text-primary-600">{formatRupiah(15000)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Batal</Button>
              </Link>
              <Button className="flex-1">Bayar Sekarang</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
