import { createFileRoute, Link } from "@tanstack/react-router";
import { useSiteData } from "@/lib/site-data-context";
import { brl } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CASARÃO — Bar & Restaurante em Vassouras" },
      {
        name: "description",
        content:
          "Carnes na chapa, petiscos, pizza e drinks no coração de Vassouras. Veja o cardápio e reserve sua mesa online.",
      },
      { property: "og:title", content: "CASARÃO — Bar & Restaurante" },
      {
        property: "og:description",
        content: "Carnes na chapa, petiscos, pizza e drinks. Reserve sua mesa online.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const data = useSiteData();
  const byKey = new Map(data.media.map((m) => [m.key, m]));
  const hero = byKey.get("hero");
  const gallery = data.media.filter((m) => m.key.startsWith("galeria_"));
  const featured = data.items.filter((i) => i.featured && i.available).slice(0, 3);
  const info = data.info;

  const marqueeItems = ["Carnes na chapa", "Petiscos", "Pizza", "Drinks", "Vassouras — RJ"];

  return (
    <main>
      <section className="relative overflow-hidden bg-espresso text-espresso-foreground">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-amber/10 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_1fr] md:py-24">
          <div>
            <p className="animate-rise text-[11px] uppercase tracking-[0.32em] text-amber">
              {info?.tagline ?? "Vassouras — RJ"}
            </p>
            <h1 className="animate-rise delay-1 mt-4 text-7xl leading-[0.9] md:text-9xl">
              {info?.name ?? "CASARÃO"}
            </h1>
            <p className="animate-rise delay-1 mt-3 font-display text-2xl italic text-amber">
              {info?.subtitle ?? "Bar & Restaurante"}
            </p>
            <p className="animate-rise delay-2 mt-6 max-w-md text-espresso-foreground/75">
              Fogo alto, carne no ponto e mesa farta. Reserve sua mesa em segundos e chegue com tudo
              garantido.
            </p>
            <div className="animate-rise delay-3 mt-9 flex flex-wrap gap-3">
              <Link
                to="/reservas"
                className="rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Reservar mesa
              </Link>
              <Link
                to="/cardapio"
                className="rounded-full border border-espresso-foreground/25 px-7 py-3.5 text-sm transition-colors hover:border-amber hover:text-amber"
              >
                Ver cardápio
              </Link>
            </div>
          </div>

          <div className="animate-rise delay-2 relative">
            {hero ? (
              <img
                src={hero.url}
                alt={hero.alt ?? "Prato da casa"}
                className="aspect-[4/5] w-full rounded-2xl object-cover shadow-2xl"
              />
            ) : null}
            {byKey.get("galeria_1") ? (
              <img
                src={byKey.get("galeria_1")!.url}
                alt={byKey.get("galeria_1")!.alt ?? ""}
                className="absolute -bottom-8 -left-6 hidden aspect-square w-36 rounded-xl border-4 border-espresso object-cover shadow-xl md:block"
              />
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden border-y border-espresso-foreground/10 py-3">
          <div className="animate-marquee flex w-max gap-8 whitespace-nowrap text-xs uppercase tracking-[0.3em] text-amber/80">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((t, i) => (
              <span key={i} className="flex items-center gap-8">
                {t} <span className="text-espresso-foreground/25">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {featured.length ? (
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl">Da nossa cozinha</h2>
            <Link to="/cardapio" className="text-sm text-primary hover:underline">
              Cardápio completo
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featured.map((d) => (
              <article
                key={d.id}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-xl"
              >
                {d.image_url ? (
                  <img
                    src={d.image_url}
                    alt={d.name}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="aspect-[4/3] w-full bg-muted" />
                )}
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-2xl">{d.name}</h3>
                    <span className="shrink-0 text-primary">{brl(d.price)}</span>
                  </div>
                  {d.description ? (
                    <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {gallery.length ? (
        <section className="bg-muted/60 py-16">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="text-4xl md:text-5xl">A mesa posta</h2>
            <p className="mt-2 text-muted-foreground">Um pouco do que sai da cozinha e chega à sua mesa.</p>
          </div>
          <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))]">
            {gallery.map((g) => (
              <figure
                key={g.key}
                className="snap-center overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-transform hover:-translate-y-1"
              >
                <img src={g.url} alt={g.alt ?? ""} className="h-72 w-[19rem] object-cover" />
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="overflow-hidden rounded-3xl bg-forest px-8 py-12 text-forest-foreground md:px-14 md:py-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <h2 className="text-4xl md:text-5xl">Sua mesa está esperando</h2>
              <p className="mt-3 max-w-md text-forest-foreground/80">
                Escolha data, horário e o número de pessoas. Levou menos de um minuto.
              </p>
            </div>
            <Link
              to="/reservas"
              className="rounded-full bg-forest-foreground px-8 py-4 text-sm font-medium text-forest transition-transform hover:scale-[1.03]"
            >
              Reservar agora
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
