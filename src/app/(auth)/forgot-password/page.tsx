"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2, Mail, ArrowLeft } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Terjadi kesalahan saat mengirim permintaan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
            <Mail className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-dark-900">Lupa Password</h1>
          <p className="mt-1 text-sm text-dark-500">
            Masukkan email kamu dan kami akan mengirimkan link untuk reset password.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              <p className="font-medium">Email terkirim!</p>
              <p className="mt-1">
                Jika email <strong>{email}</strong> terdaftar di sistem kami, kamu akan menerima link reset password dalam beberapa menit.
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke halaman masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Kirim Link Reset
            </Button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-dark-600 hover:text-dark-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke halaman masuk
            </Link>
          </form>
        )}
      </Card>
    </div>
  );
}
