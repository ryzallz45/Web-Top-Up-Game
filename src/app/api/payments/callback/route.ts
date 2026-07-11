import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { status, merchant_ref, reference } = body;

    // TODO: Verify callback signature from Tripay
    // const isValid = verifyTripayCallback(request);
    // if (!isValid) {
    //   return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 401 });
    // }

    const payment = await prisma.payment.findFirst({
      where: { orderId: merchant_ref },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, error: "Pembayaran tidak ditemukan" },
        { status: 404 }
      );
    }

    if (status === "PAID") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paidAt: new Date(),
        },
      });

      await prisma.order.update({
        where: { id: merchant_ref },
        data: { status: "PROCESSING" },
      });

      // TODO: Trigger automatic top-up process
      // await processTopUp(merchant_ref);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing callback:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses callback" },
      { status: 500 }
    );
  }
}
