import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyNotification } from "@/lib/midtrans";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const notification = body as Record<string, string>;
    const statusResponse = await verifyNotification(notification);

    const {
      order_id: orderNumber,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
    } = statusResponse;

    console.log("Midtrans notification:", {
      orderNumber,
      transaction_status,
      fraud_status,
      status_code,
      gross_amount,
    });

    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { payment: true },
    });

    if (!order) {
      console.error("Order not found:", orderNumber);
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    let paymentStatus = "PENDING";
    let orderStatus = "PENDING";

    if (transaction_status === "capture") {
      if (fraud_status === "accept") {
        paymentStatus = "PAID";
        orderStatus = "PROCESSING";
      } else if (fraud_status === "challenge") {
        paymentStatus = "PENDING";
        orderStatus = "PENDING";
      } else {
        paymentStatus = "FAILED";
        orderStatus = "FAILED";
      }
    } else if (transaction_status === "settlement") {
      paymentStatus = "PAID";
      orderStatus = "PROCESSING";
    } else if (transaction_status === "pending") {
      paymentStatus = "PENDING";
      orderStatus = "PENDING";
    } else if (transaction_status === "deny") {
      paymentStatus = "FAILED";
      orderStatus = "FAILED";
    } else if (transaction_status === "expire") {
      paymentStatus = "EXPIRED";
      orderStatus = "EXPIRED";
    } else if (transaction_status === "cancel") {
      paymentStatus = "FAILED";
      orderStatus = "CANCELLED";
    }

    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: paymentStatus,
          ...(paymentStatus === "PAID" ? { paidAt: new Date() } : {}),
        },
      });
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { status: orderStatus },
    });

    if (orderStatus === "PROCESSING") {
      console.log(`Order ${orderNumber} paid successfully. Processing top-up...`);
      // TODO: Trigger automatic top-up process here
      // await processTopUp(order.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Midtrans callback error:", error);
    return NextResponse.json(
      { success: false, error: "Callback processing failed" },
      { status: 500 }
    );
  }
}
