import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { sendSmtpTestEmail } from "@/lib/email";

export const runtime = "nodejs";

const bodySchema = z
  .object({
    to: z.string().email().optional(),
  })
  .strict();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ message: "No autenticada" }, { status: 401 });
  }

  if (session.user.rol !== "ADMIN") {
    return NextResponse.json({ message: "Sin permisos" }, { status: 403 });
  }

  const parsedBody = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsedBody.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const targetEmail =
    parsedBody.data.to ||
    process.env.SMTP_TEST_TO_EMAIL ||
    session.user.email ||
    null;

  if (!targetEmail) {
    return NextResponse.json(
      { message: "Define SMTP_TEST_TO_EMAIL o usa una sesion con correo" },
      { status: 400 },
    );
  }

  const sent = await sendSmtpTestEmail({
    to: targetEmail,
    requestedBy: session.user.email || "admin@sabores.local",
  });

  if (!sent) {
    return NextResponse.json(
      { message: "SMTP no configurado o envio fallido tras reintentos" },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { message: `Correo de prueba enviado a ${targetEmail}` },
    { status: 200 },
  );
}
