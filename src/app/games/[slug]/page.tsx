"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import ProductList from "@/components/games/ProductList";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import { Card, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import type { Product } from "@/types";

const mockGame: Record<string, { name: string; products: Product[] }> = {
  "mobile-legends": {
    name: "Mobile Legends",
    products: [
      { id: "p1", name: "56 Diamonds", description: "", price: 15000, originalPrice: 17000, nominal: "56 Diamonds", bonus: null, isActive: true, sortOrder: 1, gameId: "1" },
      { id: "p2", name: "172 Diamonds", description: "", price: 45000, originalPrice: 50000, nominal: "172 Diamonds", bonus: "+10", isActive: true, sortOrder: 2, gameId: "1" },
      { id: "p3", name: "568 Diamonds", description: "", price: 145000, originalPrice: 155000, nominal: "568 Diamonds", bonus: "+50", isActive: true, sortOrder: 3, gameId: "1" },
    ],
  },
  "free-fire": {
    name: "Free Fire",
    products: [
      { id: "p4", name: "110 Diamonds", description: "", price: 16000, originalPrice: 18000, nominal: "110 Diamonds", bonus: null, isActive: true, sortOrder: 1, gameId: "2" },
      { id: "p5", name: "330 Diamonds", description: "", price: 46000, originalPrice: 50000, nominal: "330 Diamonds", bonus: "+10", isActive: true, sortOrder: 2, gameId: "2" },
    ],
  },
};

export default function GameDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const game = mockGame[slug];

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "checkout" | "payment">("select");

  if (!game) {
    return (
      <div className="container-page section-padding text-center">
        <span className="text-6xl">🎮</span>
        <h1 className="mt-4 text-2xl font-bold text-dark-900">Game tidak ditemukan</h1>
        <Link href="/games" className="mt-4 inline-block">
          <Button variant="outline">Kembali ke Semua Game</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page section-padding">
      <Link href="/games" className="mb-6 inline-flex items-center gap-2 text-sm text-dark-500 hover:text-dark-700">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Semua Game
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">{game.name}</h1>
        <p className="mt-2 text-dark-500">Pilih nominal dan lakukan pembayaran</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardTitle>1. Pilih Nominal</CardTitle>
            <div className="mt-4">
              <ProductList
                products={game.products}
                selectedId={selectedProduct?.id || null}
                onSelect={(product) => {
                  setSelectedProduct(product);
                  setStep("checkout");
                }}
              />
            </div>
          </Card>

          {step !== "select" && (
            <Card>
              <CardTitle>2. Masukkan Data</CardTitle>
              <div className="mt-4">
                <CheckoutForm
                  onSubmit={(data) => {
                    console.log("Checkout data:", data);
                    setStep("payment");
                  }}
                />
              </div>
            </Card>
          )}

          {step === "payment" && (
            <Card>
              <CardTitle>3. Pembayaran</CardTitle>
              <div className="mt-4">
                <PaymentMethod
                  selectedMethod={selectedPayment}
                  onSelect={setSelectedPayment}
                />
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardTitle>Ringkasan Pesanan</CardTitle>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-dark-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-200">
                  🎮
                </div>
                <div>
                  <div className="text-sm font-medium text-dark-900">{game.name}</div>
                  {selectedProduct && (
                    <div className="text-xs text-dark-500">{selectedProduct.nominal}</div>
                  )}
                </div>
              </div>

              {selectedProduct && (
                <div className="space-y-2 border-t border-dark-100 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-dark-500">Harga</span>
                    <span className="font-medium text-dark-900">{formatRupiah(selectedProduct.price)}</span>
                  </div>
                  {selectedProduct.bonus && (
                    <div className="flex justify-between text-sm">
                      <span className="text-dark-500">Bonus</span>
                      <span className="font-medium text-green-600">{selectedProduct.bonus}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-dark-100 pt-2">
                    <span className="font-medium text-dark-700">Total</span>
                    <span className="text-lg font-bold text-primary-600">{formatRupiah(selectedProduct.price)}</span>
                  </div>
                </div>
              )}

              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                  <p className="text-xs text-blue-600">
                    Pastikan data yang dimasukkan sudah benar. Pesanan yang sudah diproses tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
