import { Suspense } from "react";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="bg-sabores-gradient min-h-full px-6 py-10">
      <Suspense fallback={<div className="card-soft mx-auto w-full max-w-md p-6">Cargando...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
