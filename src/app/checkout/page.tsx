"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function CheckoutPage() {
  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-lg text-center">
        <Card>
          <div className="flex flex-col items-center">
            <span className="text-5xl">🛒</span>
            <h1 className="mt-4 text-xl font-bold text-dark-900">Checkout</h1>
            <p className="mt-2 text-sm text-dark-500">
              Pilih game terlebih dahulu untuk mulai top up
            </p>
            <div className="mt-6 flex w-full gap-3">
              <Link href="/games" className="flex-1">
                <Button className="w-full">Pilih Game</Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full">Kembali</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
