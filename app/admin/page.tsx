import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { SmtpTestButton } from "@/components/admin/SmtpTestButton";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.rol !== "ADMIN") {
    redirect("/unauthorized");
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
      <section className="card-soft p-8">
        <h1 className="text-3xl font-bold text-[var(--sabores-verde-oscuro)]">Panel de administracion</h1>
        <p className="mt-2 text-[#566050]">Solo usuarios con rol ADMIN pueden entrar a esta pagina.</p>
        <SmtpTestButton />
      </section>
    </main>
  );
}
