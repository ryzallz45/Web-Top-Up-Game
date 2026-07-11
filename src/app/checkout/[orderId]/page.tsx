"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatRupiah } from "@/lib/utils";

interface OrderData {
  orderId: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  payment: {
    method: string;
    status: string;
    amount: number;
    paidAt: string | null;
  } | null;
  items: {
    name: string;
    nominal: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
}

const statusBadge: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "default" }> = {
  SUCCESS: { label: "Berhasil", variant: "success" },
  PROCESSING: { label: "Diproses", variant: "warning" },
  PENDING: { label: "Menunggu Pembayaran", variant: "info" },
  FAILED: { label: "Gagal", variant: "danger" },
  CANCELLED: { label: "Dibatalkan", variant: "default" },
  EXPIRED: { label: "Kedaluwarsa", variant: "default" },
};

export default function CheckoutDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const status = searchParams.get("status");

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    fetch(`/api/payments/status?orderId=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || "Gagal memuat data");
        }
      })
      .catch(() => setError("Gagal memuat data pesanan"))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="container-page section-padding">
        <div className="mx-auto max-w-lg text-center">
          <Card>
            <div className="py-8 text-dark-400">Memuat data pesanan...</div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-page section-padding">
        <div className="mx-auto max-w-lg text-center">
          <Card>
            <span className="text-4xl">❌</span>
            <h1 className="mt-4 text-xl font-bold text-dark-900">Pesanan Tidak Ditemukan</h1>
            <p className="mt-2 text-sm text-dark-500">{error || "Data pesanan tidak ditemukan"}</p>
            <Link href="/" className="mt-4 inline-block">
              <Button>Kembali ke Beranda</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const badge = statusBadge[order.status] || { label: order.status, variant: "default" as const };

  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-lg">
        {status === "success" && (
          <div className="mb-6 rounded-xl bg-green-50 p-4 text-center">
            <span className="text-4xl">✅</span>
            <h2 className="mt-2 text-lg font-bold text-green-700">Pembayaran Berhasil!</h2>
            <p className="text-sm text-green-600">Pesanan kamu sedang diproses</p>
          </div>
        )}

        {status === "pending" && (
          <div className="mb-6 rounded-xl bg-yellow-50 p-4 text-center">
            <span className="text-4xl">⏳</span>
            <h2 className="mt-2 text-lg font-bold text-yellow-700">Menunggu Pembayaran</h2>
            <p className="text-sm text-yellow-600">Silakan selesaikan pembayaran sebelum waktu habis</p>
          </div>
        )}

        <Card>
          <div className="flex items-center justify-between">
            <CardTitle>Detail Pesanan</CardTitle>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-dark-500">No. Pesanan</p>
                <p className="font-mono text-sm font-medium text-dark-900">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Tanggal</p>
                <p className="text-sm font-medium text-dark-900">
                  {new Date(order.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-dark-100 pt-4">
              <h3 className="mb-3 text-sm font-medium text-dark-700">Item</h3>
              {order.items.map((item, index) => (
                <div key={index} className="mb-2 flex items-center justify-between rounded-lg bg-dark-50 p-3">
                  <div>
                    <p className="text-sm font-medium text-dark-900">{item.name}</p>
                    <p className="text-xs text-dark-500">{item.nominal}</p>
                  </div>
                  <p className="text-sm font-medium text-dark-900">{formatRupiah(item.price)}</p>
                </div>
              ))}
            </div>

            {order.payment && (
              <div className="border-t border-dark-100 pt-4">
                <h3 className="mb-3 text-sm font-medium text-dark-700">Pembayaran</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Metode</span>
                    <span className="font-medium text-dark-900">{order.payment.method.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Status</span>
                    <Badge variant={statusBadge[order.payment.status]?.variant || "default"}>
                      {statusBadge[order.payment.status]?.label || order.payment.status}
                    </Badge>
                  </div>
                  {order.payment.paidAt && (
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">Dibayar pada</span>
                      <span className="text-dark-900">
                        {new Date(order.payment.paidAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-dark-100 pt-4">
              <div className="flex justify-between">
                <span className="font-medium text-dark-700">Total Pembayaran</span>
                <span className="text-xl font-bold text-primary-600">{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Kembali</Button>
              </Link>
              {order.status === "PENDING" && (
                <Button className="flex-1" onClick={() => window.location.reload()}>
                  Cek Status
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
