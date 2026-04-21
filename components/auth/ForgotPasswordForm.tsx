"use client";

import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [devResetLink, setDevResetLink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setDevResetLink(null);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = (await response.json().catch(() => null)) as
      | { message?: string; resetUrl?: string }
      | null;

    setMessage(data?.message || "Revisa tu correo para continuar.");
    if (data?.resetUrl) {
      setDevResetLink(data.resetUrl);
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={onSubmit} className="card-soft mx-auto w-full max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold text-[var(--sabores-verde-oscuro)]">Recuperar contrasena</h1>
      <p className="text-sm text-[#566050]">Ingresa tu correo y te enviaremos un enlace para restablecerla.</p>

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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[var(--sabores-verde-medio)] px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        {isLoading ? "Enviando..." : "Enviar enlace"}
      </button>

      {message ? <p className="text-sm text-[#44513d]">{message}</p> : null}

      {devResetLink ? (
        <p className="text-sm">
          En desarrollo, usa este enlace: <a href={devResetLink} className="underline">{devResetLink}</a>
        </p>
      ) : null}
    </form>
  );
}
