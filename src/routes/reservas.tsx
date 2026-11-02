import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { useSiteData } from "@/lib/site-data-context";
import { submitReservation } from "@/lib/site.functions";

export const Route = createFileRoute("/reservas")({
  head: () => ({
    meta: [
      { title: "Reservas — CASARÃO Bar & Restaurante" },
      {
        name: "description",
        content: "Reserve sua mesa no CASARÃO em Vassouras: escolha data, horário e número de pessoas.",
      },
      { property: "og:title", content: "Reservas — CASARÃO" },
      {
        property: "og:description",
        content: "Escolha data, horário e número de pessoas. Levou menos de um minuto.",
      },
    ],
  }),
  component: Reservas,
});

const horarios = ["12:00", "12:30", "13:00", "13:30", "14:00", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"];
const field =
  "mt-1.5 w-full rounded-lg border border-input bg-card px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/40";

function Reservas() {
  const { info } = useSiteData();
  const send = useServerFn(submitReservation);
  const [hora, setHora] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const hoje = new Date().toISOString().slice(0, 10);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!hora) {
      toast.error("Escolha um horário");
      return;
    }
    const f = new FormData(e.currentTarget);
    const partySize = Number(f.get("pessoas"));
    const date = String(f.get("data"));

    setSending(true);
    const result = await send({
      data: {
        name: String(f.get("nome") ?? ""),
        phone: String(f.get("telefone") ?? ""),
        email: String(f.get("email") ?? ""),
        partySize,
        date,
        time: hora,
        notes: String(f.get("obs") ?? ""),
      },
    });
    setSending(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }

    const [y, m, d] = date.split("-");
    setDone(
      `${String(f.get("nome")).split(" ")[0]}, sua mesa para ${partySize} ${
        partySize === 1 ? "pessoa" : "pessoas"
      } em ${d}/${m}/${y} às ${hora} está registrada.`,
    );
    toast.success("Reserva registrada!");
  }

  if (done) {
    return (
      <main className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber">Tudo certo</p>
        <h1 className="mt-4 text-6xl text-primary">Até breve!</h1>
        <p className="mt-4 text-muted-foreground">{done}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Se precisar mudar alguma coisa, é só chamar a gente pelo WhatsApp ou telefone.
        </p>
        <button
          onClick={() => {
            setDone(null);
            setHora("");
          }}
          className="mt-8 rounded-full border px-6 py-3 text-sm transition-colors hover:bg-muted"
        >
          Fazer outra reserva
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.3em] text-primary">CASARÃO Bar & Restaurante</p>
      <h1 className="mt-3 text-6xl">Reserve sua mesa</h1>
      <p className="mt-3 text-muted-foreground">
        Escolha dia, horário e quantos vêm. Para grupos acima de 20 pessoas, fale direto com a gente.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm">
            Data
            <input name="data" type="date" min={hoje} required defaultValue={hoje} className={field} />
          </label>
          <label className="text-sm">
            Pessoas
            <select name="pessoas" required defaultValue="2" className={field}>
              {Array.from({ length: 20 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <p className="text-sm">Horário</p>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {horarios.map((h) => (
              <button
                type="button"
                key={h}
                onClick={() => setHora(h)}
                className={`rounded-lg border py-2 text-sm transition-colors ${
                  hora === h
                    ? "border-espresso bg-espresso text-espresso-foreground"
                    : "bg-card hover:border-primary"
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <label className="block text-sm">
          Nome
          <input name="nome" required placeholder="Como podemos te chamar?" className={field} />
        </label>
        <label className="block text-sm">
          Telefone / WhatsApp
          <input name="telefone" type="tel" required placeholder="(24) 90000-0000" className={field} />
        </label>
        <label className="block text-sm">
          E-mail (opcional)
          <input name="email" type="email" className={field} />
        </label>
        <label className="block text-sm">
          Observações
          <textarea
            name="obs"
            rows={3}
            placeholder="Aniversário, alergias, cadeirinha, mesa na varanda..."
            className={field}
          />
        </label>

        <button
          disabled={sending}
          className="w-full rounded-full bg-primary py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {sending ? "Registrando..." : "Confirmar reserva"}
        </button>

        {info?.whatsapp ? (
          <p className="text-center text-sm text-muted-foreground">
            Prefere falar com alguém?{" "}
            <a
              href={`https://wa.me/${info.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Chame no WhatsApp
            </a>
            .
          </p>
        ) : null}
      </form>
    </main>
  );
}
