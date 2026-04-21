import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const registerSchema = z
  .object({
    nombre: z.string().min(2),
    apellido: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Datos invalidos", errors: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const email = parsed.data.email.toLowerCase();

    const exists = await prisma.usuario.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ message: "El correo ya esta registrado" }, { status: 409 });
    }

    const passwordHash = await hash(parsed.data.password, 12);

    const user = await prisma.usuario.create({
      data: {
        nombre: parsed.data.nombre,
        apellido: parsed.data.apellido,
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
      },
    });

    return NextResponse.json({ message: "Usuario creado", user }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Error interno al registrar" }, { status: 500 });
  }
}
