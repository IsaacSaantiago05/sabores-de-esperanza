"use client";

import { useState } from "react";

export function SmtpTestButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/smtp-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        setError(data?.message || "No se pudo probar SMTP.");
        return;
      }

      setMessage(data?.message || "Correo de prueba enviado.");
    } catch {
      setError("Error de red al probar SMTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card-soft mt-6 p-5">
      <h2 className="text-xl font-semibold text-[var(--sabores-verde-oscuro)]">Prueba de SMTP</h2>
      <p className="mt-2 text-sm text-[#566050]">
        Envia un correo de prueba para validar credenciales SMTP en un clic.
      </p>

      <button
        onClick={handleTest}
        disabled={isLoading}
        className="mt-4 rounded-lg bg-[var(--sabores-verde-medio)] px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        {isLoading ? "Enviando prueba..." : "Probar SMTP"}
      </button>

      {message ? <p className="mt-3 text-sm text-green-700">{message}</p> : null}
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
