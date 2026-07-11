"use client";

import { cn } from "@/lib/utils";
import { CreditCard, Wallet, Smartphone } from "lucide-react";

interface PaymentMethodProps {
  selectedMethod: string | null;
  onSelect: (method: string) => void;
}

const paymentMethods = [
  { id: "bank_transfer", name: "Bank Transfer", icon: CreditCard, description: "BCA, Mandiri, BRI, BNI" },
  { id: "ewallet", name: "E-Wallet", icon: Wallet, description: "GoPay, OVO, Dana, ShopeePay" },
  { id: "qris", name: "QRIS", icon: Smartphone, description: "Scan QR untuk bayar" },
];

export default function PaymentMethod({ selectedMethod, onSelect }: PaymentMethodProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-dark-700">Pilih Metode Pembayaran</h3>
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={cn(
            "flex w-full items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
            selectedMethod === method.id
              ? "border-primary-600 bg-primary-50"
              : "border-dark-200 hover:border-primary-300"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-100">
            <method.icon className="h-5 w-5 text-dark-600" />
          </div>
          <div>
            <div className="text-sm font-semibold text-dark-900">{method.name}</div>
            <div className="text-xs text-dark-500">{method.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
