import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { sendOrderConfirmation } from "@/lib/email";

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
          include: { product: { include: { game: true } } },
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, productId, gameAccountId, gameServerId, playerName, email, phone } = body;

    if (!userId || !productId || !gameAccountId) {
      return NextResponse.json(
        { success: false, error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { game: true },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produk tidak ditemukan" },
        { status: 404 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        totalAmount: product.price,
        userId,
        gameAccountId,
        gameServerId,
        playerName,
        email,
        phone,
        items: {
          create: {
            productId,
            price: product.price,
            quantity: 1,
          },
        },
      },
      include: {
        items: true,
      },
    });

    if (user?.email) {
      sendOrderConfirmation({
        orderNumber: order.orderNumber,
        customerName: user.name || "Customer",
        customerEmail: user.email,
        gameName: product.game.name,
        nominal: product.nominal,
        productName: product.name,
        price: product.price,
        gameAccountId,
        gameServerId,
        playerName,
      }).catch((err) => console.error("Failed to send order confirmation email:", err));
    }

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat pesanan" },
      { status: 500 }
    );
  }
}
