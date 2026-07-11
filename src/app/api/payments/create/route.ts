import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSnapTransaction } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, method } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Order ID harus diisi" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { include: { game: true } } } },
        payment: true,
        user: true,
      },
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

    const paymentMethod = method || "bank_transfer";

    const payment = await prisma.payment.create({
      data: {
        orderId,
        method: paymentMethod,
        amount: order.totalAmount,
        fee: 0,
        total: order.totalAmount,
        expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    const items = order.items.map((item) => ({
      id: item.productId,
      name: `${item.product.game.name} - ${item.product.nominal}`,
      price: item.price,
      quantity: item.quantity,
      brand: item.product.game.name,
      category: item.product.game.category,
    }));

    let paymentMethods: string[] | undefined;
    if (paymentMethod === "bank_transfer") {
      paymentMethods = ["bca_va", "mandiri_va", "bri_va", "bni_va", "permata_va"];
    } else if (paymentMethod === "ewallet") {
      paymentMethods = ["gopay", "shopeepay", "dana"];
    } else if (paymentMethod === "qris") {
      paymentMethods = ["qris"];
    }

    const customer = {
      first_name: order.user?.name || order.playerName || "Customer",
      email: order.email || order.user?.email || "",
      phone: order.phone || "",
    };

    const snapResult = await createSnapTransaction({
      orderId: order.orderNumber,
      amount: order.totalAmount,
      items,
      customer,
      paymentMethods,
      callbacks: {
        finish: `${process.env.NEXTAUTH_URL}/checkout/${order.id}?status=success`,
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { paymentUrl: snapResult.redirect_url },
    });

    return NextResponse.json({
      success: true,
      data: {
        paymentId: payment.id,
        redirect_url: snapResult.redirect_url,
        token: snapResult.token,
      },
    });
  } catch (error) {
    console.error("Payment create error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat pembayaran" },
      { status: 500 }
    );
  }
}
