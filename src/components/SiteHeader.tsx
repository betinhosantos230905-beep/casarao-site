import { Link } from "@tanstack/react-router";
import { useSiteData } from "@/lib/site-data-context";

const navLink =
  "text-sm text-muted-foreground transition-colors hover:text-foreground";
const navActive = { className: "text-sm font-medium text-primary" };

export function SiteHeader() {
  const data = useSiteData();
  const logo = data?.media.find((m) => m.key === "logo")?.url;
  const name = data?.info?.name ?? "CASARÃO";
  const subtitle = data?.info?.subtitle ?? "Bar & Restaurante";

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link to="/" className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt={`${name} — ${subtitle}`}
              width={52}
              height={52}
              className="h-12 w-12 rounded-full border border-border bg-card object-contain p-1"
            />
          ) : null}
          <span className="leading-tight">
            <span className="block font-display text-2xl tracking-wide text-foreground">{name}</span>
            <span className="block text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {subtitle}
            </span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link to="/cardapio" className={navLink} activeProps={navActive}>
            Cardápio
          </Link>
          <Link
            to="/reservas"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Reservar
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const data = useSiteData();
  const info = data?.info;
  const logo = data?.media.find((m) => m.key === "logo")?.url;
  const name = info?.name ?? "CASARÃO";

  return (
    <footer className="mt-24 bg-espresso text-espresso-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={`${name} — ${info?.subtitle ?? "Bar & Restaurante"}`}
                width={56}
                height={56}
                className="h-14 w-14 rounded-full bg-card object-contain p-1"
              />
            ) : null}
            <span>
              <span className="block font-display text-3xl">{name}</span>
              <span className="block text-[10px] uppercase tracking-[0.28em] text-amber">
                {info?.subtitle ?? "Bar & Restaurante"}
              </span>
            </span>
          </div>
          {info?.tagline ? <p className="mt-4 text-sm text-espresso-foreground/70">{info.tagline}</p> : null}
        </div>

        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-amber">Onde estamos</p>
          <p className="mt-3 text-espresso-foreground/80">
            {info?.address ? info.address : <span className="italic opacity-60">Endereço a confirmar</span>}
          </p>
          {info?.phone ? <p className="mt-2 text-espresso-foreground/80">{info.phone}</p> : null}
          {info?.instagram ? (
            <p className="mt-2">
              <a
                href={`https://instagram.com/${info.instagram.replace("@", "").replace(/^https?:\/\/instagram\.com\//, "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber hover:underline"
              >
                @{info.instagram.replace("@", "")}
              </a>
            </p>
          ) : null}
        </div>

        <div className="text-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-amber">Horários</p>
          {info?.hours_lunch ? <p className="mt-3 text-espresso-foreground/80">{info.hours_lunch}</p> : null}
          {info?.hours_dinner ? <p className="mt-1 text-espresso-foreground/80">{info.hours_dinner}</p> : null}
          {!info?.hours_lunch && !info?.hours_dinner ? (
            <p className="mt-3 italic opacity-60">Horários a confirmar</p>
          ) : null}
          <p className="mt-4 text-espresso-foreground/50">
            {info?.whatsapp ? (
              <a
                href={`https://wa.me/${info.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-amber hover:underline"
              >
                Chamar no WhatsApp
              </a>
            ) : null}
          </p>
        </div>
      </div>

      <div className="border-t border-espresso-foreground/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-5 py-4 text-xs text-espresso-foreground/45">
          <p>© {new Date().getFullYear()} {name}</p>
          <Link to="/admin" className="hover:text-amber">
            Área administrativa
          </Link>
        </div>
      </div>
    </footer>
  );
}
