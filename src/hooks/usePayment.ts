"use client";

import { useState } from "react";

interface PaymentOptions {
  orderId: string;
  method: string;
}

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async ({ orderId, method }: PaymentOptions) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, method }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal membuat pembayaran";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createPayment, isLoading, error };
}
