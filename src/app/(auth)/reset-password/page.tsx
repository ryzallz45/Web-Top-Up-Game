"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Gamepad2, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  if (!token) {
    return (
      <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <div className="mb-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
              <Gamepad2 className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-dark-900">Token Tidak Valid</h1>
            <p className="mt-1 text-sm text-dark-500">
              Link reset password tidak valid atau sudah kadaluarsa.
            </p>
          </div>
          <Link
            href="/forgot-password"
            className="flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Minta link reset baru
          </Link>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error);
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Terjadi kesalahan saat mengubah password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
            <Gamepad2 className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-dark-900">Buat Password Baru</h1>
          <p className="mt-1 text-sm text-dark-500">
            Masukkan password baru untuk akun kamu.
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
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <p className="font-medium">Password berhasil diubah!</p>
              </div>
              <p className="mt-1">
                Kamu sekarang bisa masuk dengan password baru kamu.
              </p>
            </div>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-sm font-medium text-primary-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Masuk sekarang
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                label="Password Baru"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password baru"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-dark-400 hover:text-dark-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                label="Konfirmasi Password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Ulangi password baru"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-dark-400 hover:text-dark-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Ubah Password
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
            </div>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
