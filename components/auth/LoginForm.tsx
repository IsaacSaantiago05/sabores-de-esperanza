"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Credenciales invalidas. Verifica tu correo y contrasena.");
      setIsLoading(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="card-soft mx-auto w-full max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold text-[var(--sabores-verde-oscuro)]">Iniciar sesion</h1>

      <label className="block text-sm font-medium">
        Correo
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#d9c9b7] bg-white px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium">
        Contrasena
        <input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#d9c9b7] bg-white px-3 py-2"
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[var(--sabores-verde-medio)] px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-sm text-[#566050]">
        Olvidaste tu contrasena?{" "}
        <Link
          href="/recuperar-contrasena"
          className="font-semibold text-[var(--sabores-verde-oscuro)] underline"
        >
          Recuperarla
        </Link>
      </p>

      <p className="text-sm text-[#566050]">
        No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-[var(--sabores-verde-oscuro)] underline">
          Registrate
        </Link>
      </p>
    </form>
  );
}
