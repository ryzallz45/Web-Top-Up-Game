import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId");
    const orderNumber = searchParams.get("orderNumber");

    if (!orderId && !orderNumber) {
      return NextResponse.json(
        { success: false, error: "orderId atau orderNumber harus diisi" },
        { status: 400 }
      );
    }

    let where: { id: string } | { orderNumber: string };
    if (orderId) {
      where = { id: orderId };
    } else {
      where = { orderNumber: orderNumber! };
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        totalAmount: order.totalAmount,
        payment: order.payment
          ? {
              method: order.payment.method,
              status: order.payment.status,
              amount: order.payment.amount,
              paidAt: order.payment.paidAt,
            }
          : null,
        items: order.items.map((item) => ({
          name: item.product.name,
          nominal: item.product.nominal,
          price: item.price,
          quantity: item.quantity,
        })),
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil status pembayaran" },
      { status: 500 }
    );
  }
}
