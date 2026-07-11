import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, method } = body;

    if (!orderId || !method) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (order.payment) {
      return NextResponse.json(
        { success: false, error: "Pesanan sudah memiliki pembayaran" },
        { status: 400 }
      );
    }

    const fee = method === "qris" ? 0 : Math.round(order.totalAmount * 0.005);

    const payment = await prisma.payment.create({
      data: {
        orderId,
        method,
        amount: order.totalAmount,
        fee,
        total: order.totalAmount + fee,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // TODO: Integrate with Tripay/Payment Gateway
    // const tripayResponse = await createTripayCheckout(order, method);

    return NextResponse.json({
      success: true,
      data: {
        ...payment,
        paymentUrl: "#mock-payment-url",
      },
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat pembayaran" },
      { status: 500 }
    );
  }
}
