import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { deleteMenuItem, listMenuItems, saveMenuItem } from "@/lib/admin.functions";
import { CATEGORIES, brl, type Category, type MenuItem } from "@/lib/types";

export const Route = createFileRoute("/admin/cardapio")({
  loader: () => listMenuItems(),
  head: () => ({
    meta: [
      { title: "Cardápio — Painel CASARÃO" },
      { name: "description", content: "Edite os pratos, preços e fotos do cardápio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CardapioAdmin,
});

type Draft = {
  id?: string;
  category: Category;
  name: string;
  description: string;
  price: string;
  image_url: string;
  featured: boolean;
  available: boolean;
  sort_order: number;
};

const emptyDraft = (category: Category): Draft => ({
  category,
  name: "",
  description: "",
  price: "",
  image_url: "",
  featured: false,
  available: true,
  sort_order: 0,
});

const toDraft = (i: MenuItem): Draft => ({
  id: i.id,
  category: i.category,
  name: i.name,
  description: i.description ?? "",
  price: String(i.price),
  image_url: i.image_url ?? "",
  featured: i.featured,
  available: i.available,
  sort_order: i.sort_order,
});

const input =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40";

function CardapioAdmin() {
  const router = useRouter();
  const save = useServerFn(saveMenuItem);
  const remove = useServerFn(deleteMenuItem);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [busy, setBusy] = useState(false);

  const items = Route.useLoaderData();

  function refresh() {
    void router.invalidate();
  }

  async function guardar() {
    if (!draft) return;
    setBusy(true);
    const r = await save({
      data: {
        item: {
          id: draft.id,
          category: draft.category,
          name: draft.name,
          description: draft.description,
          price: Number(draft.price || 0),
          image_url: draft.image_url || null,
          featured: draft.featured,
          available: draft.available,
          sort_order: Number(draft.sort_order || 0),
        },
      },
    });
    setBusy(false);
    if (r.ok) {
      toast.success(draft.id ? "Item atualizado" : "Item adicionado");
      setDraft(null);
      refresh();
    } else toast.error(r.error ?? "Não foi possível salvar");
  }

  async function apagar(i: MenuItem) {
    if (!window.confirm(`Remover "${i.name}" do cardápio?`)) return;
    const r = await remove({ data: { id: i.id } });
    if (r.ok) {
      toast.success("Item removido");
      refresh();
    } else toast.error("Não foi possível remover");
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl">Cardápio</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} itens cadastrados</p>
        </div>
        <button
          onClick={() => setDraft(emptyDraft("entradas"))}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Adicionar item
        </button>
      </div>

      {draft ? (
        <div className="mt-6 rounded-2xl border border-primary/30 bg-card p-5">
          <h2 className="text-xl">{draft.id ? "Editar item" : "Novo item"}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Nome
              <input
                className={input}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Categoria
              <select
                className={input}
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as Category })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm sm:col-span-2">
              Descrição
              <textarea
                rows={2}
                className={input}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Preço (R$)
              <input
                type="number"
                min="0"
                step="0.5"
                className={input}
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: e.target.value })}
              />
            </label>
            <label className="text-sm">
              Ordem (menor aparece primeiro)
              <input
                type="number"
                className={input}
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              Endereço da foto (opcional)
              <input
                className={input}
                placeholder="/api/public/media/..."
                value={draft.image_url}
                onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              />
              Destaque na página inicial
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) => setDraft({ ...draft, available: e.target.checked })}
              />
              Disponível hoje
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={guardar}
              disabled={busy}
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Salvando..." : "Salvar"}
            </button>
            <button
              onClick={() => setDraft(null)}
              className="rounded-full border px-6 py-2.5 text-sm hover:bg-muted"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {CATEGORIES.map((c) => {
          const doGrupo = items.filter((i) => i.category === c.id);
          if (!doGrupo.length) return null;
          return (
            <div key={c.id}>
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{c.label}</p>
              <ul className="mt-2 space-y-2">
                {doGrupo.map((i) => (
                  <li
                    key={i.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3"
                  >
                    {i.image_url ? (
                      <img src={i.image_url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-muted" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {i.name}
                        {i.featured ? <span className="ml-2 text-xs text-amber-foreground">✦ destaque</span> : null}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {brl(i.price)}
                        {i.available ? "" : " · esgotado"}
                      </p>
                    </div>
                    <button
                      onClick={() => setDraft(toDraft(i))}
                      className="rounded-full border px-4 py-1.5 text-sm hover:bg-muted"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => apagar(i)}
                      className="rounded-full border border-destructive/40 px-4 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
