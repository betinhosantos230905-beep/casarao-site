import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAdminState, unlockSite } from "@/lib/gate.functions";
import { AdminNav } from "@/components/AdminNav";

export const Route = createFileRoute("/admin")({
  loader: async () => {
    const { unlocked } = await getAdminState();
    return { unlocked };
  },
  head: () => ({
    meta: [
      { title: "Entrar — Painel CASARÃO" },
      { name: "description", content: "Acesso restrito à área administrativa do CASARÃO." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const { unlocked } = Route.useLoaderData();
  if (!unlocked) return <AdminLogin />;

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminNav />
      <div className="mx-auto max-w-6xl px-5 py-8">
        <Outlet />
      </div>
    </div>
  );
}

function AdminLogin() {
  const unlock = useServerFn(unlockSite);
  const router = useRouter();
  const [error, setError] = useState(false);
  // Starts busy so a tap before JavaScript loads can't do a native submit
  // that reloads the page (and puts the password in the address bar).
  const [busy, setBusy] = useState(true);
  useEffect(() => setBusy(false), []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    setBusy(true);
    const { ok } = await unlock({ data: { password } });
    setBusy(false);
    if (ok) {
      await router.invalidate();
      await router.navigate({ to: "/admin/reservas" });
    } else {
      setError(true);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-espresso px-5 py-16 text-espresso-foreground">
      <form method="post" onSubmit={onSubmit} className="w-full max-w-sm rounded-2xl bg-card p-8 text-card-foreground shadow-2xl">
        <p className="text-[11px] uppercase tracking-[0.3em] text-primary">CASARÃO</p>
        <h1 className="mt-2 text-4xl">Área administrativa</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Digite a senha que o dono do restaurante passou.
        </p>

        <label className="mt-6 block text-sm">
          Senha
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 outline-none focus:ring-2 focus:ring-ring/40"
          />
        </label>

        {error ? <p className="mt-3 text-sm text-destructive">Senha incorreta. Tente de novo.</p> : null}

        <button
          disabled={busy}
          className="mt-6 w-full rounded-full bg-primary py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy ? "Entrando..." : "Entrar"}
        </button>

        <a href="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">
          Voltar ao site
        </a>
      </form>
    </main>
  );
}
