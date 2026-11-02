import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getRestaurantInfo, saveRestaurantInfo } from "@/lib/admin.functions";
import type { RestaurantInfo } from "@/lib/types";

export const Route = createFileRoute("/admin/info")({
  loader: () => getRestaurantInfo(),
  head: () => ({
    meta: [
      { title: "Dados do restaurante — Painel CASARÃO" },
      { name: "description", content: "Endereço, telefone, horários e redes sociais." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: InfoAdmin,
});

const input =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/40";

function InfoAdmin() {
  const router = useRouter();
  const data = Route.useLoaderData();
  const save = useServerFn(saveRestaurantInfo);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<RestaurantInfo>(
    data ?? {
      name: "CASARÃO",
      subtitle: "Bar & Restaurante",
      tagline: "",
      address: "",
      phone: "",
      whatsapp: "",
      instagram: "",
      hours_lunch: "",
      hours_dinner: "",
    },
  );

  async function guardar() {
    setBusy(true);
    const r = await save({ data: { info: form } });
    setBusy(false);
    if (r.ok) {
      toast.success("Dados salvos");
      void router.invalidate();
    } else toast.error("Não foi possível salvar");
  }

  const set = (k: keyof RestaurantInfo) => (e: { target: { value: string } }) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <section className="max-w-2xl">
      <h1 className="text-4xl">Dados do restaurante</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        O que você preencher aqui aparece no topo, no rodapé e na página de reservas.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          Nome
          <input className={input} value={form.name} onChange={set("name")} />
        </label>
        <label className="text-sm">
          Subtítulo
          <input className={input} value={form.subtitle} onChange={set("subtitle")} />
        </label>
        <label className="text-sm sm:col-span-2">
          Frase curta (aparece no topo da página inicial)
          <input className={input} value={form.tagline ?? ""} onChange={set("tagline")} />
        </label>
        <label className="text-sm sm:col-span-2">
          Endereço
          <input className={input} value={form.address ?? ""} onChange={set("address")} />
        </label>
        <label className="text-sm">
          Telefone
          <input className={input} value={form.phone ?? ""} onChange={set("phone")} />
        </label>
        <label className="text-sm">
          WhatsApp (só números)
          <input className={input} value={form.whatsapp ?? ""} onChange={set("whatsapp")} />
        </label>
        <label className="text-sm">
          Instagram
          <input className={input} value={form.instagram ?? ""} onChange={set("instagram")} />
        </label>
        <label className="text-sm">
          Horário do almoço
          <input className={input} value={form.hours_lunch ?? ""} onChange={set("hours_lunch")} />
        </label>
        <label className="text-sm">
          Horário do jantar
          <input className={input} value={form.hours_dinner ?? ""} onChange={set("hours_dinner")} />
        </label>
      </div>

      <button
        onClick={guardar}
        disabled={busy}
        className="mt-6 rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Salvando..." : "Salvar dados"}
      </button>
    </section>
  );
}
