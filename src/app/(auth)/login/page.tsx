"use client";

import { useState } from "react";
import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="flex min-h-[calc(100vh-128px)] items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
            <Gamepad2 className="h-6 w-6 text-primary-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-dark-900">Masuk ke Akun</h1>
          <p className="mt-1 text-sm text-dark-500">
            Belum punya akun?{" "}
            <Link href="/register" className="font-medium text-primary-600 hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="email@contoh.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-dark-600">
              <input type="checkbox" className="rounded border-dark-300" />
              Ingat saya
            </label>
            <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
              Lupa password?
            </Link>
          </div>
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Masuk
          </Button>
        </form>
      </Card>
    </div>
  );
}
