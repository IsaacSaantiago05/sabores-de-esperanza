import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="bg-sabores-gradient min-h-full px-6 py-10">
      <section className="card-soft mx-auto max-w-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-[var(--sabores-verde-oscuro)]">Acceso denegado</h1>
        <p className="mt-3 text-[#566050]">No tienes permisos suficientes para ver esta seccion.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/dashboard" className="rounded-lg bg-[var(--sabores-verde-medio)] px-4 py-2 font-semibold text-white">
            Ir al dashboard
          </Link>
          <Link href="/login" className="rounded-lg border border-[var(--sabores-verde-oscuro)] px-4 py-2 font-semibold text-[var(--sabores-verde-oscuro)]">
            Cambiar sesion
          </Link>
        </div>
      </section>
    </main>
  );
}
