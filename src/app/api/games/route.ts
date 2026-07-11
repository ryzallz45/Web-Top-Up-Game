import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category && category !== "Semua") {
      where.category = category;
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const games = await prisma.game.findMany({
      where,
      include: {
        products: {
          where: { isActive: true },
          orderBy: { price: "asc" },
        },
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data game" },
      { status: 500 }
    );
  }
}
