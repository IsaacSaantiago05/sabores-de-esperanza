import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const resetSchema = z
  .object({
    token: z.string().min(20),
    newPassword: z.string().min(8),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = resetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Datos invalidos" }, { status: 400 });
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: parsed.data.token },
      include: { user: true },
    });

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ message: "Token invalido o expirado" }, { status: 400 });
    }

    const passwordHash = await hash(parsed.data.newPassword, 12);

    await prisma.$transaction([
      prisma.usuario.update({
        where: { id: resetToken.userId },
        data: { password: passwordHash },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ message: "Contrasena actualizada" }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
