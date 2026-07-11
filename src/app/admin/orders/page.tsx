"use client";

import { useEffect, useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { formatRupiah } from "@/lib/utils";
import { CheckCircle, XCircle, Clock, RefreshCw, Eye } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  gameAccountId: string;
  gameServerId: string | null;
  playerName: string | null;
  user: { id: string; name: string | null; email: string };
  items: { product: { name: string; nominal: string; game: { name: string } }; price: number }[];
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

const filters = ["Semua", "PENDING", "PROCESSING", "SUCCESS", "FAILED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => { if (data.success) setOrders(data.data); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
      } else {
        alert(data.error || "Gagal mengubah status");
      }
    } catch {
      alert("Gagal mengubah status pesanan");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = activeFilter === "Semua"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dark-900">Kelola Pesanan</h1>
        <p className="mt-1 text-dark-500">Monitor dan kelola semua pesanan</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <Button
            key={f}
            variant={activeFilter === f ? "primary" : "ghost"}
            size="sm"
            onClick={() => setActiveFilter(f)}
          >
            {f === "Semua" ? f : (statusBadge[f]?.label || f)}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent>
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
                    <th className="pb-3 font-medium text-dark-500">Produk</th>
                    <th className="pb-3 font-medium text-dark-500">Amount</th>
                    <th className="pb-3 font-medium text-dark-500">Status</th>
                    <th className="pb-3 font-medium text-dark-500">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-50">
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-dark-400">Tidak ada pesanan</td></tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const badge = statusBadge[order.status] || { label: order.status, variant: "default" as const };
                      return (
                        <tr key={order.id} className="hover:bg-dark-50">
                          <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                          <td className="py-3">
                            <div className="text-sm">{order.user?.name || "-"}</div>
                            <div className="text-xs text-dark-400">{order.user?.email}</div>
                          </td>
                          <td className="py-3">{order.items[0]?.product?.game?.name || "-"}</td>
                          <td className="py-3">
                            <div className="text-sm">{order.items[0]?.product?.name || "-"}</div>
                            <div className="text-xs text-dark-400">{order.items[0]?.product?.nominal}</div>
                          </td>
                          <td className="py-3 font-medium">{formatRupiah(order.totalAmount)}</td>
                          <td className="py-3"><Badge variant={badge.variant}>{badge.label}</Badge></td>
                          <td className="py-3">
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm" onClick={() => setDetailOrder(order)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.status === "PENDING" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => updateStatus(order.id, "PROCESSING")}
                                    disabled={updatingId === order.id}
                                  >
                                    <Clock className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => updateStatus(order.id, "CANCELLED")}
                                    disabled={updatingId === order.id}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {order.status === "PROCESSING" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => updateStatus(order.id, "SUCCESS")}
                                    disabled={updatingId === order.id}
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => updateStatus(order.id, "FAILED")}
                                    disabled={updatingId === order.id}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              {(order.status === "FAILED" || order.status === "CANCELLED") && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-blue-600 hover:text-blue-700"
                                  onClick={() => updateStatus(order.id, "PENDING")}
                                  disabled={updatingId === order.id}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={!!detailOrder} onClose={() => setDetailOrder(null)} title="Detail Pesanan">
        {detailOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-dark-500">No. Pesanan</p>
                <p className="font-mono text-sm font-medium">{detailOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Status</p>
                <Badge variant={statusBadge[detailOrder.status]?.variant || "default"}>
                  {statusBadge[detailOrder.status]?.label || detailOrder.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-dark-500">User</p>
                <p className="text-sm font-medium">{detailOrder.user?.name || "-"}</p>
                <p className="text-xs text-dark-400">{detailOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Game</p>
                <p className="text-sm font-medium">{detailOrder.items[0]?.product?.game?.name || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">ID Akun Game</p>
                <p className="font-mono text-sm font-medium">{detailOrder.gameAccountId}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Server</p>
                <p className="text-sm font-medium">{detailOrder.gameServerId || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Nama Pemain</p>
                <p className="text-sm font-medium">{detailOrder.playerName || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Produk</p>
                <p className="text-sm font-medium">{detailOrder.items[0]?.product?.name} ({detailOrder.items[0]?.product?.nominal})</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Total</p>
                <p className="text-sm font-bold text-primary-600">{formatRupiah(detailOrder.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Pembayaran</p>
                <p className="text-sm font-medium">{detailOrder.payment?.method?.toUpperCase() || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-dark-500">Tanggal</p>
                <p className="text-sm font-medium">
                  {new Date(detailOrder.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
            {detailOrder.status === "PENDING" && (
              <div className="border-t border-dark-100 pt-4">
                <p className="mb-2 text-sm font-medium text-dark-700">Ubah Status:</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { updateStatus(detailOrder.id, "PROCESSING"); setDetailOrder(null); }}>
                    Proses
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => { updateStatus(detailOrder.id, "CANCELLED"); setDetailOrder(null); }}>
                    Batalkan
                  </Button>
                </div>
              </div>
            )}
            {detailOrder.status === "PROCESSING" && (
              <div className="border-t border-dark-100 pt-4">
                <p className="mb-2 text-sm font-medium text-dark-700">Ubah Status:</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => { updateStatus(detailOrder.id, "SUCCESS"); setDetailOrder(null); }}>
                    Berhasil
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => { updateStatus(detailOrder.id, "FAILED"); setDetailOrder(null); }}>
                    Gagal
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
