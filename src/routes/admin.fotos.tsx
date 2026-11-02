import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listMedia, setMedia } from "@/lib/admin.functions";
import type { MediaItem } from "@/lib/types";

export const Route = createFileRoute("/admin/fotos")({
  loader: () => listMedia(),
  head: () => ({
    meta: [
      { title: "Fotos — Painel CASARÃO" },
      { name: "description", content: "Troque o logo e as fotos do site." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: FotosAdmin,
});

const LOCAIS: { key: string; label: string; hint: string }[] = [
  { key: "logo", label: "Logo", hint: "Aparece no topo e no rodapé de todas as páginas." },
  { key: "hero", label: "Foto principal", hint: "A foto grande da página inicial." },
  { key: "galeria_1", label: "Galeria 1", hint: "Também aparece pequena sobre a foto principal." },
  { key: "galeria_2", label: "Galeria 2", hint: "Faixa de fotos da página inicial." },
  { key: "galeria_3", label: "Galeria 3", hint: "Faixa de fotos da página inicial." },
  { key: "galeria_4", label: "Galeria 4", hint: "Faixa de fotos da página inicial." },
  { key: "galeria_5", label: "Galeria 5", hint: "Faixa de fotos da página inicial." },
];

function FotosAdmin() {
  const router = useRouter();
  const byKey = new Map(Route.useLoaderData().map((m) => [m.key, m]));

  return (
    <section>
      <h1 className="text-4xl">Fotos e logo</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Envie uma imagem nova para trocar a que está no ar. JPG, PNG ou WebP, até 10 MB.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {LOCAIS.map((l) => (
          <MediaCard
            key={l.key}
            mediaKey={l.key}
            label={l.label}
            hint={l.hint}
            item={byKey.get(l.key)}
            onSaved={() => void router.invalidate()}
          />
        ))}
      </div>
    </section>
  );
}

function MediaCard({
  mediaKey,
  label,
  hint,
  item,
  onSaved,
}: {
  mediaKey: string;
  label: string;
  hint: string;
  item?: MediaItem | undefined;
  onSaved: () => void;
}) {
  const save = useServerFn(setMedia);
  const [busy, setBusy] = useState(false);
  const [alt, setAlt] = useState(item?.alt ?? "");

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    const fd = new FormData();
    fd.append("key", mediaKey);
    fd.append("file", file);

    const res = await fetch("/api/public/admin-media", { method: "POST", body: fd });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };

    if (!json.ok || !json.url) {
      toast.error(json.error ?? "Não foi possível enviar a imagem.");
      setBusy(false);
      return;
    }

    const r = await save({ data: { key: mediaKey, url: json.url, alt } });
    setBusy(false);
    if (r.ok) {
      toast.success(`${label} atualizado`);
      onSaved();
    } else toast.error("A imagem subiu, mas não deu para aplicar no site.");
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-medium">{label}</h2>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
        {busy ? <span className="text-xs text-muted-foreground">enviando...</span> : null}
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted">
        {item?.url ? (
          <img src={item.url} alt={item.alt ?? ""} className="h-40 w-full object-cover" />
        ) : (
          <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
            Sem imagem
          </div>
        )}
      </div>

      <label className="mt-3 block text-sm">
        Descrição da imagem (ajuda quem usa leitor de tela)
        <textarea
          rows={2}
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40"
        />
      </label>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-full border px-4 py-2 text-sm hover:bg-muted">
          {busy ? "Enviando..." : "Escolher arquivo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              void onFile(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </label>
        <button
          onClick={async () => {
            if (!item?.url) return;
            const r = await save({ data: { key: mediaKey, url: item.url, alt } });
            if (r.ok) {
              toast.success("Descrição salva");
              onSaved();
            }
          }}
          className="rounded-full border px-4 py-2 text-sm hover:bg-muted"
        >
          Salvar descrição
        </button>
      </div>
    </article>
  );
}
