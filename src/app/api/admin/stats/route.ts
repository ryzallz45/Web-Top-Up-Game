import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const [totalRevenue, totalOrders, totalUsers, totalGames] = await Promise.all([
      prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { total: true } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.game.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalUsers,
        totalGames,
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ success: false, error: "Gagal mengambil statistik" }, { status: 500 });
  }
}
