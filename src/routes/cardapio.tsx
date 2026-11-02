import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useSiteData } from "@/lib/site-data-context";
import { CATEGORIES, brl, type Category } from "@/lib/types";

export const Route = createFileRoute("/cardapio")({
  head: () => ({
    meta: [
      { title: "Cardápio — CASARÃO Bar & Restaurante" },
      {
        name: "description",
        content:
          "Entradas, pratos, sobremesas e bebidas do CASARÃO: carnes na chapa, petiscos, pizza e drinks.",
      },
      { property: "og:title", content: "Cardápio — CASARÃO" },
      {
        property: "og:description",
        content: "Entradas, pratos, sobremesas e bebidas. Reserve sua mesa online.",
      },
    ],
  }),
  component: Cardapio,
});

function Cardapio() {
  const data = useSiteData();
  const [tab, setTab] = useState<Category>("entradas");
  const items = data.items.filter((i) => i.category === tab);
  const label = CATEGORIES.find((c) => c.id === tab)?.label ?? "Cardápio";

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-primary">CASARÃO Bar & Restaurante</p>
      <h1 className="mt-3 text-6xl md:text-7xl">Cardápio</h1>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setTab(c.id)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors ${
              tab === c.id
                ? "bg-espresso text-espresso-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mt-8 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</p>

      <ul className="mt-4 space-y-4">
        {items.length === 0 ? (
          <li className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Nada por aqui ainda.
          </li>
        ) : null}

        {items.map((d) => (
          <li
            key={d.id}
            className={`flex gap-4 rounded-2xl border bg-card p-4 transition-shadow hover:shadow-md ${
              d.available ? "" : "opacity-60"
            }`}
          >
            {d.image_url ? (
              <img
                src={d.image_url}
                alt={d.name}
                className="h-20 w-20 shrink-0 rounded-xl object-cover sm:h-24 sm:w-24"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <h2 className="text-xl sm:text-2xl">{d.name}</h2>
                <span className="hidden flex-1 border-b border-dotted border-foreground/25 sm:block" />
                <span className="ml-auto shrink-0 text-primary sm:ml-0">{brl(d.price)}</span>
              </div>
              {d.description ? (
                <p className="mt-1 text-sm text-muted-foreground">{d.description}</p>
              ) : null}
              {!d.available ? (
                <p className="mt-1 text-xs uppercase tracking-wider text-destructive">Esgotado hoje</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/reservas"
          className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
        >
          Reservar mesa
        </Link>
        <Link
          to="/"
          className="rounded-full border border-border px-7 py-3.5 text-sm transition-colors hover:bg-muted"
        >
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
