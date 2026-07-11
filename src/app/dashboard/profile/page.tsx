"use client";

import { useState } from "react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { User } from "lucide-react";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "08123456789",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="container-page section-padding">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-900">Profil Saya</h1>
          <p className="mt-1 text-dark-500">Kelola informasi akun kamu</p>
        </div>

        <Card>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-dark-900">John Doe</h2>
              <p className="text-sm text-dark-500">john@example.com</p>
            </div>
          </div>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                label="Nomor Telepon"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline">Batal</Button>
                <Button type="submit" isLoading={isLoading}>Simpan Perubahan</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
