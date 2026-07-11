"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductSelectProps {
  products: Product[];
  gameName: string;
}

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess?: (result: Record<string, unknown>) => void;
        onPending?: (result: Record<string, unknown>) => void;
        onError?: (result: Record<string, unknown>) => void;
        onClose?: () => void;
      }) => void;
    };
  }
}

export default function ProductSelect({ products, gameName }: ProductSelectProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "checkout" | "payment">("select");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleCheckout = async (data: {
    gameAccountId: string;
    gameServerId: string;
    playerName: string;
    email: string;
    phone: string;
  }) => {
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    if (!selectedProduct) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          productId: selectedProduct.id,
          gameAccountId: data.gameAccountId,
          gameServerId: data.gameServerId,
          playerName: data.playerName,
          email: data.email,
          phone: data.phone,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || "Gagal membuat pesanan");
      }

      setOrderId(orderData.data.id);
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment || !orderId) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, method: selectedPayment }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || "Gagal membuat pembayaran");
      }

      if (data.data.token && window.snap) {
        window.snap.pay(data.data.token, {
          onSuccess: (result) => {
            console.log("Payment success:", result);
            router.push(`/checkout/${orderId}?status=success`);
          },
          onPending: (result) => {
            console.log("Payment pending:", result);
            router.push(`/checkout/${orderId}?status=pending`);
          },
          onError: (result) => {
            console.error("Payment error:", result);
            setError("Pembayaran gagal. Silakan coba lagi.");
          },
          onClose: () => {
            setError("Pembayaran dibatalkan. Silakan coba lagi jika belum membayar.");
          },
        });
      } else if (data.data.redirect_url) {
        window.location.href = data.data.redirect_url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => {
              setSelectedProduct(product);
              setStep("checkout");
            }}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              selectedProduct?.id === product.id
                ? "border-primary-600 bg-primary-50 ring-1 ring-primary-600"
                : "border-dark-200 hover:border-primary-300 hover:bg-dark-50"
            }`}
          >
            <div className="text-sm font-semibold text-dark-900">{product.nominal}</div>
            {product.bonus && (
              <div className="mt-1 text-xs font-medium text-green-600">
                Bonus: {product.bonus}
              </div>
            )}
            <div className="mt-2">
              <span className="text-base font-bold text-primary-600">
                {formatRupiah(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-2 text-xs text-dark-400 line-through">
                  {formatRupiah(product.originalPrice)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {step === "checkout" && selectedProduct && (
        <div className="border-t border-dark-100 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-dark-900">Masukkan Data Akun</h3>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <CheckoutForm onSubmit={handleCheckout} isLoading={isSubmitting} />
        </div>
      )}

      {step === "payment" && (
        <div className="border-t border-dark-100 pt-6">
          <h3 className="mb-4 text-lg font-semibold text-dark-900">Pilih Pembayaran</h3>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}
          <PaymentMethod selectedMethod={selectedPayment} onSelect={setSelectedPayment} />
          {selectedPayment && (
            <div className="mt-4 rounded-lg bg-dark-50 p-4">
              <div className="flex justify-between">
                <span className="text-sm text-dark-600">Total Bayar</span>
                <span className="text-lg font-bold text-primary-600">
                  {formatRupiah(selectedProduct!.price)}
                </span>
              </div>
              <Button
                className="mt-3 w-full"
                onClick={handlePayment}
                isLoading={isSubmitting}
              >
                Bayar Sekarang
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
