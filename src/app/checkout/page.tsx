import { Card, CardTitle } from "@/components/ui/Card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-lg text-center">
        <Card>
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="mt-4">Pesanan Berhasil Dibuat!</CardTitle>
            <p className="mt-2 text-sm text-dark-500">
              Silakan selesaikan pembayaran sebelum waktu habis
            </p>
            <div className="mt-6 w-full space-y-2">
              <div className="flex justify-between rounded-lg bg-dark-50 px-4 py-2 text-sm">
                <span className="text-dark-500">No. Pesanan</span>
                <span className="font-mono font-medium text-dark-900">GT-250711-ABC123</span>
              </div>
              <div className="flex justify-between rounded-lg bg-dark-50 px-4 py-2 text-sm">
                <span className="text-dark-500">Status</span>
                <span className="font-medium text-yellow-600">Menunggu Pembayaran</span>
              </div>
              <div className="flex justify-between rounded-lg bg-dark-50 px-4 py-2 text-sm">
                <span className="text-dark-500">Total</span>
                <span className="font-bold text-primary-600">Rp15.000</span>
              </div>
            </div>
            <div className="mt-6 flex w-full gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Kembali</Button>
              </Link>
              <Link href="/dashboard/orders" className="flex-1">
                <Button className="w-full">Lihat Pesanan</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
