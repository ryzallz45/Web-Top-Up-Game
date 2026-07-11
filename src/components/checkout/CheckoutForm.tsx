"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface CheckoutFormProps {
  onSubmit: (data: {
    gameAccountId: string;
    gameServerId: string;
    playerName: string;
    email: string;
    phone: string;
  }) => void;
  isLoading?: boolean;
}

export default function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [formData, setFormData] = useState({
    gameAccountId: "",
    gameServerId: "",
    playerName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="ID Akun Game"
        placeholder="Masukkan ID akun game"
        value={formData.gameAccountId}
        onChange={(e) => setFormData({ ...formData, gameAccountId: e.target.value })}
        required
      />
      <Input
        label="Server (opsional)"
        placeholder="Masukkan server"
        value={formData.gameServerId}
        onChange={(e) => setFormData({ ...formData, gameServerId: e.target.value })}
      />
      <Input
        label="Nama Karakter"
        placeholder="Masukkan nama karakter"
        value={formData.playerName}
        onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}
      />
      <Input
        label="Email"
        type="email"
        placeholder="Masukkan email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <Input
        label="Nomor Telepon"
        type="tel"
        placeholder="Masukkan nomor telepon"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Lanjut ke Pembayaran
      </Button>
    </form>
  );
}
