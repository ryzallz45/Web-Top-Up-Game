import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error("Games error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil data game" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, category, description } = body;

    if (!name || !slug || !category) {
      return NextResponse.json({ success: false, error: "Nama, slug, dan kategori harus diisi" }, { status: 400 });
    }

    const existing = await prisma.game.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ success: false, error: "Slug sudah digunakan" }, { status: 400 });
    }

    const maxOrder = await prisma.game.aggregate({ _max: { sortOrder: true } });

    const game = await prisma.game.create({
      data: {
        name,
        slug,
        category,
        description,
        sortOrder: (maxOrder._max.sortOrder || 0) + 1,
      },
    });

    return NextResponse.json({ success: true, data: game }, { status: 201 });
  } catch (error) {
    console.error("Create game error:", error);
    return NextResponse.json({ success: false, error: "Gagal membuat game" }, { status: 500 });
  }
}
