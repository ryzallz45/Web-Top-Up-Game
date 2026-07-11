import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get("gameId");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (gameId) {
      where.gameId = gameId;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        game: true,
      },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data produk" },
      { status: 500 }
    );
  }
}
