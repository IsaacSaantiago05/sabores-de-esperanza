import { randomBytes } from "crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const forgotSchema = z
  .object({
    email: z.string().email(),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = forgotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Correo invalido" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const user = await prisma.usuario.findUnique({ where: { email } });

    const generic = {
      message: "Si el correo existe, recibira instrucciones para restablecer la contrasena.",
    };

    if (!user) {
      return NextResponse.json(generic, { status: 200 });
    }

    const token = randomBytes(32).toString("hex");
    const ttlMinutes = Number(process.env.RESET_PASSWORD_TOKEN_TTL_MINUTES || "60");
    const expiresAt = new Date(Date.now() + 1000 * 60 * ttlMinutes);

    await prisma.passwordResetToken.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        token,
        expiresAt,
      },
      update: {
        token,
        expiresAt,
        usedAt: null,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/restablecer-contrasena?token=${token}`;

    try {
      await sendPasswordResetEmail({
        to: user.email,
        nombre: user.nombre,
        resetUrl,
      });
    } catch (error) {
      console.error("Error enviando correo de recuperacion", error);
    }

    return NextResponse.json(
      {
        ...generic,
        resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
