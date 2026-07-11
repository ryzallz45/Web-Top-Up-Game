import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { game: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Products error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, gameId, price, originalPrice, nominal, bonus } = body;

    if (!name || !gameId || !price || !nominal) {
      return NextResponse.json({ success: false, error: "Data tidak lengkap" }, { status: 400 });
    }

    const maxOrder = await prisma.product.aggregate({ _max: { sortOrder: true } });

    const product = await prisma.product.create({
      data: {
        name,
        gameId,
        price,
        originalPrice: originalPrice || null,
        nominal,
        bonus: bonus || null,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ success: false, error: "Gagal membuat produk" }, { status: 500 });
  }
}
