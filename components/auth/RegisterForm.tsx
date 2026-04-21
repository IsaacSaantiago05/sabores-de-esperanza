"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido, email, password }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(data?.message || "No se pudo crear la cuenta.");
      setIsLoading(false);
      return;
    }

    const loginResult = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (loginResult?.error) {
      setError("Cuenta creada, pero no se pudo iniciar sesion automaticamente.");
      setIsLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit} className="card-soft mx-auto w-full max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold text-[var(--sabores-verde-oscuro)]">Crear cuenta</h1>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Nombre
          <input
            type="text"
            required
            minLength={2}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d9c9b7] bg-white px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium">
          Apellido
          <input
            type="text"
            required
            minLength={2}
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d9c9b7] bg-white px-3 py-2"
          />
        </label>
      </div>

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

      <label className="block text-sm font-medium">
        Confirmar contrasena
        <input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[#d9c9b7] bg-white px-3 py-2"
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[var(--sabores-verde-medio)] px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        {isLoading ? "Creando cuenta..." : "Registrar"}
      </button>

      <p className="text-sm text-[#566050]">
        Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-[var(--sabores-verde-oscuro)] underline">
          Inicia sesion
        </Link>
      </p>
    </form>
  );
}
