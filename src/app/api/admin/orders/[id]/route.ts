import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status } = body;

    const validStatuses = ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "CANCELLED", "EXPIRED"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Status harus salah satu dari: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status },
    });

    if (order.payment && (status === "SUCCESS" || status === "FAILED" || status === "CANCELLED")) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: status === "SUCCESS" ? "PAID" : status === "CANCELLED" ? "FAILED" : "FAILED",
          ...(status === "SUCCESS" ? { paidAt: new Date() } : {}),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Status pesanan berhasil diubah ke ${status}`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengubah status pesanan" },
      { status: 500 }
    );
  }
}
