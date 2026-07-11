import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, price, originalPrice, nominal, bonus, description, isActive } = body;

    if (!name || !price || !nominal) {
      return NextResponse.json(
        { success: false, error: "Nama, harga, dan nominal harus diisi" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        nominal,
        bonus: bonus || null,
        description: description || null,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal update produk" },
      { status: 500 }
    );
  }
}
