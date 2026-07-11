import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone } = body;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name, phone },
      select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ success: false, error: "Gagal update profil" }, { status: 500 });
  }
}
