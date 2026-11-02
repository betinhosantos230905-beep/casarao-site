import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { deleteReservation, listReservations, setReservationStatus } from "@/lib/admin.functions";
import { dateBR, type Reservation } from "@/lib/types";

export const Route = createFileRoute("/admin/reservas")({
  loader: () => listReservations(),
  head: () => ({
    meta: [
      { title: "Reservas — Painel CASARÃO" },
      { name: "description", content: "Acompanhe e confirme as reservas do CASARÃO." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ReservasAdmin,
});

const FILTROS = [
  { id: "todas", label: "Todas" },
  { id: "pendente", label: "Pendentes" },
  { id: "confirmada", label: "Confirmadas" },
  { id: "cancelada", label: "Canceladas" },
  { id: "concluida", label: "Concluídas" },
] as const;

const BADGE: Record<Reservation["status"], string> = {
  pendente: "bg-amber/25 text-amber-foreground",
  confirmada: "bg-forest/15 text-forest",
  cancelada: "bg-destructive/15 text-destructive",
  concluida: "bg-muted text-muted-foreground",
};

function ReservasAdmin() {
  const router = useRouter();
  const [filtro, setFiltro] = useState<string>("todas");
  const reservas = Route.useLoaderData();
  const setStatus = useServerFn(setReservationStatus);
  const remove = useServerFn(deleteReservation);

  const visiveis = filtro === "todas" ? reservas : reservas.filter((r) => r.status === filtro);
  const pendentes = reservas.filter((r) => r.status === "pendente").length;

  async function mudar(id: string, status: Reservation["status"]) {
    const r = await setStatus({ data: { id, status } });
    if (r.ok) {
      toast.success("Reserva atualizada");
      void router.invalidate();
    } else toast.error("Não foi possível atualizar");
  }

  async function apagar(id: string) {
    if (!window.confirm("Apagar esta reserva? Não dá para desfazer.")) return;
    const r = await remove({ data: { id } });
    if (r.ok) {
      toast.success("Reserva apagada");
      void router.invalidate();
    } else toast.error("Não foi possível apagar");
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl">Reservas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {reservas.length} no total
            {pendentes ? ` · ${pendentes} aguardando confirmação` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {FILTROS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                filtro === f.id ? "bg-espresso text-espresso-foreground" : "bg-card hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {visiveis.length === 0 ? (
          <p className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
            Nenhuma reserva aqui.
          </p>
        ) : null}

        {visiveis.map((r) => (
          <article key={r.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-lg font-medium">{r.name}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {dateBR(r.reserved_on)} às {r.reserved_time} · {r.party_size}{" "}
                  {r.party_size === 1 ? "pessoa" : "pessoas"} · {r.phone}
                  {r.email ? ` · ${r.email}` : ""}
                </p>
                {r.notes ? (
                  <p className="mt-2 rounded-lg bg-muted px-3 py-2 text-sm">{r.notes}</p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider ${BADGE[r.status]}`}
                >
                  {r.status}
                </span>
                {r.status !== "confirmada" ? (
                  <button
                    onClick={() => mudar(r.id, "confirmada")}
                    className="rounded-full bg-forest px-3 py-1.5 text-xs text-forest-foreground hover:opacity-90"
                  >
                    Confirmar
                  </button>
                ) : null}
                {r.status !== "concluida" ? (
                  <button
                    onClick={() => mudar(r.id, "concluida")}
                    className="rounded-full border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    Concluir
                  </button>
                ) : null}
                {r.status !== "cancelada" ? (
                  <button
                    onClick={() => mudar(r.id, "cancelada")}
                    className="rounded-full border px-3 py-1.5 text-xs hover:bg-muted"
                  >
                    Cancelar
                  </button>
                ) : null}
                <button
                  onClick={() => apagar(r.id)}
                  className="rounded-full border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                >
                  Apagar
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

