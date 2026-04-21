export default function Home() {
  return (
    <div className="bg-sabores-gradient min-h-full">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 md:px-10">
        <section className="card-soft p-8 md:p-12">
          <p className="mb-4 inline-flex rounded-full bg-[#e9f3df] px-4 py-1 text-sm font-semibold text-[var(--sabores-verde-oscuro)]">
            Plataforma en desarrollo
          </p>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-[var(--sabores-verde-oscuro)] md:text-5xl">
            Sabores de Esperanza
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[#44513d]">
            Conectamos empresas donadoras con organizaciones beneficiadas para reducir el desperdicio de alimentos y aumentar el impacto social.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/dashboard"
              className="rounded-lg bg-[var(--sabores-verde-medio)] px-5 py-3 font-semibold text-white transition hover:bg-[var(--sabores-verde-oscuro)]"
            >
              Ver dashboard inicial
            </a>
            <a
              href="/registro"
              className="rounded-lg border border-[var(--sabores-verde-oscuro)] px-5 py-3 font-semibold text-[var(--sabores-verde-oscuro)] transition hover:bg-[var(--sabores-beige)]"
            >
              Crear cuenta
            </a>
            <a
              href="/login"
              className="rounded-lg border border-[var(--sabores-verde-oscuro)] px-5 py-3 font-semibold text-[var(--sabores-verde-oscuro)] transition hover:bg-[var(--sabores-beige)]"
            >
              Iniciar sesion
            </a>
            <a
              href="/recuperar-contrasena"
              className="rounded-lg border border-[var(--sabores-verde-oscuro)] px-5 py-3 font-semibold text-[var(--sabores-verde-oscuro)] transition hover:bg-[var(--sabores-beige)]"
            >
              Recuperar contrasena
            </a>
            <a
              href="/admin"
              className="rounded-lg border border-[var(--sabores-verde-oscuro)] px-5 py-3 font-semibold text-[var(--sabores-verde-oscuro)] transition hover:bg-[var(--sabores-beige)]"
            >
              Panel admin
            </a>
            <a
              href="/api/health"
              className="rounded-lg border border-[var(--sabores-verde-oscuro)] px-5 py-3 font-semibold text-[var(--sabores-verde-oscuro)] transition hover:bg-[var(--sabores-beige)]"
            >
              Probar API de salud
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="card-soft p-6">
            <h2 className="mb-2 text-xl font-semibold text-[var(--sabores-verde-oscuro)]">Autenticacion</h2>
            <p className="text-[#566050]">Base instalada con NextAuth y utilidades para avanzar en login y registro.</p>
          </article>
          <article className="card-soft p-6">
            <h2 className="mb-2 text-xl font-semibold text-[var(--sabores-verde-oscuro)]">Base de datos</h2>
            <p className="text-[#566050]">Prisma conectado a PostgreSQL con el esquema completo del proyecto.</p>
          </article>
          <article className="card-soft p-6">
            <h2 className="mb-2 text-xl font-semibold text-[var(--sabores-verde-oscuro)]">Siguiente paso</h2>
            <p className="text-[#566050]">Formulario de registro de empresas y flujo de donaciones fase por fase.</p>
          </article>
        </section>
      </main>
    </div>
  );
}
