import { Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { lockSite } from "@/lib/gate.functions";

const tabs = [
  { to: "/admin/reservas", label: "Reservas" },
  { to: "/admin/cardapio", label: "Cardápio" },
  { to: "/admin/fotos", label: "Fotos" },
  { to: "/admin/info", label: "Dados" },
] as const;

export function AdminNav() {
  const lock = useServerFn(lockSite);
  const router = useRouter();

  async function sair() {
    await lock({ data: undefined });
    await router.navigate({ to: "/admin", replace: true });
    await router.invalidate();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 py-3">
        <Link to="/admin" className="mr-2 font-display text-xl">
          Painel CASARÃO
        </Link>
        <nav className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "rounded-full bg-espresso px-4 py-2 text-sm text-espresso-foreground" }}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Ver site
          </Link>
          <button
            onClick={sair}
            className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
