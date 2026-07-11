import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import prisma from "@/lib/prisma";
import { Card, CardTitle } from "@/components/ui/Card";
import ProductSelect from "@/components/games/ProductSelect";

export default async function GameDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const game = await prisma.game.findUnique({
    where: { slug: params.slug },
    include: {
      products: { where: { isActive: true }, orderBy: { price: "asc" } },
    },
  });

  if (!game) notFound();

  return (
    <div className="container-page section-padding">
      <Link href="/games" className="mb-6 inline-flex items-center gap-2 text-sm text-dark-500 hover:text-dark-700">
        <ArrowLeft className="h-4 w-4" />
        Kembali ke Semua Game
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-dark-900">{game.name}</h1>
          <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
            {game.category}
          </span>
        </div>
        {game.description && (
          <p className="mt-2 text-dark-500">{game.description}</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardTitle>Pilih Nominal</CardTitle>
            <ProductSelect products={game.products} gameName={game.name} />
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardTitle>Ringkasan</CardTitle>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-dark-50 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-dark-200">
                  🎮
                </div>
                <div>
                  <div className="text-sm font-medium text-dark-900">{game.name}</div>
                  <div className="text-xs text-dark-500">{game.products.length} nominal tersedia</div>
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                  <p className="text-xs text-blue-600">
                    Pilih nominal di atas, masukkan data akun, lalu lakukan pembayaran.
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
