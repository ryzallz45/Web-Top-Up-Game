import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, category, description } = body;

    const game = await prisma.game.update({
      where: { id: params.id },
      data: { name, category, description },
    });

    return NextResponse.json({ success: true, data: game });
  } catch (error) {
    console.error("Update game error:", error);
    return NextResponse.json({ success: false, error: "Gagal update game" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.game.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Game berhasil dihapus" });
  } catch (error) {
    console.error("Delete game error:", error);
    return NextResponse.json({ success: false, error: "Gagal hapus game" }, { status: 500 });
  }
}
