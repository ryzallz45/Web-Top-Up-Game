import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const isAdmin = session.user.role === "ADMIN";

    const where = isAdmin ? {} : { userId: session.user.id };

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: { product: true },
        },
        payment: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data pesanan" },
      { status: 500 }
    );
  }
}
