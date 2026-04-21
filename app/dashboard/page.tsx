import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const [totalEmpresas, donacionesActivas, totalKgDonados, totalPersonas] = await Promise.all([
    prisma.empresa.count({ where: { activo: true } }),
    prisma.donacion.count({ where: { estado: { in: ["PENDIENTE", "CONFIRMADA"] } } }),
    prisma.donacion.aggregate({
      _sum: {
        cantidadKg: true,
      },
      where: { estado: "ENTREGADA" },
    }),
    prisma.empresa.aggregate({
      _sum: {
        personasAtendidas: true,
      },
      where: { tipoEmpresa: "Beneficiada", activo: true },
    }),
  ]);

  const stats = [
    { label: "Empresas registradas", value: String(totalEmpresas) },
    { label: "Donaciones activas", value: String(donacionesActivas) },
    { label: "Kg donados", value: String(Math.round(totalKgDonados._sum.cantidadKg || 0)) },
    { label: "Personas atendidas", value: String(totalPersonas._sum.personasAtendidas || 0) },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
        <h1 className="text-3xl font-bold text-[var(--sabores-verde-oscuro)]">Dashboard inicial</h1>
          <p className="mt-2 text-[#566050]">
            Bienvenida, {session.user.name || session.user.email}. KPIs en tiempo real del banco de comida.
          </p>
        </div>
        <SignOutButton />
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="card-soft p-5">
            <p className="text-sm text-[#566050]">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-[var(--sabores-verde-oscuro)]">{item.value}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
