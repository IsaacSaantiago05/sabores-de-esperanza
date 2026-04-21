"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="rounded-lg border border-[var(--sabores-verde-oscuro)] px-3 py-2 text-sm font-semibold text-[var(--sabores-verde-oscuro)]"
    >
      Cerrar sesion
    </button>
  );
}
