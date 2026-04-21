import { Suspense } from "react";

import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function RestablecerContrasenaPage() {
  return (
    <main className="bg-sabores-gradient min-h-full px-6 py-10">
      <Suspense fallback={<div className="card-soft mx-auto w-full max-w-md p-6">Cargando...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
