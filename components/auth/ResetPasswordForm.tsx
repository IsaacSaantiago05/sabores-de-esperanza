"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError("No se encontro el token de recuperacion.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    setIsLoading(true);

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setError(data?.message || "No se pudo restablecer la contrasena.");
      setIsLoading(false);
      return;
    }

    setSuccess("Contrasena actualizada. Seras redirigida al login.");
    setIsLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 1200);
  };

  return (
    <form onSubmit={onSubmit} className="card-soft mx-auto w-full max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold text-[var(--sabores-verde-oscuro)]">Restablecer contrasena</h1>

      <label className="block text-sm font-medium">
        Nueva contrasena
        <input
          type="password"
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
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
      {success ? <p className="text-sm text-green-700">{success}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-[var(--sabores-verde-medio)] px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        {isLoading ? "Actualizando..." : "Actualizar contrasena"}
      </button>
    </form>
  );
}
