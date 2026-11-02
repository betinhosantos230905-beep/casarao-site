import { createServerFn } from "@tanstack/react-start";
import type { MediaItem, MenuItem, RestaurantInfo } from "@/lib/types";

export type SiteData = {
  info: RestaurantInfo | null;
  media: MediaItem[];
  items: MenuItem[];
};

export const getSiteData = createServerFn({ method: "GET" }).handler(async (): Promise<SiteData> => {
  const { publicClient } = await import("./public-client.server");
  const sb = publicClient();

  const [info, media, items] = await Promise.all([
    sb.from("restaurant_info").select("*").eq("id", 1).maybeSingle(),
    sb.from("site_media").select("key, url, alt").order("key"),
    sb.from("menu_items").select("*").order("category").order("sort_order"),
  ]);

  return {
    info: (info.data as RestaurantInfo | null) ?? null,
    media: (media.data as MediaItem[] | null) ?? [],
    items: (items.data as MenuItem[] | null) ?? [],
  };
});

export type NewReservation = {
  name: string;
  phone: string;
  email?: string;
  partySize: number;
  date: string;
  time: string;
  notes?: string;
};

export const submitReservation = createServerFn({ method: "POST" })
  .inputValidator((data: NewReservation) => data)
  .handler(async ({ data }) => {
    const name = (data.name ?? "").trim();
    const phone = (data.phone ?? "").trim();
    const time = (data.time ?? "").trim();
    const date = (data.date ?? "").trim();

    if (!name || !phone) return { ok: false as const, error: "Preencha seu nome e telefone." };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false as const, error: "Escolha uma data válida." };
    if (date < new Date().toISOString().slice(0, 10))
      return { ok: false as const, error: "A data precisa ser hoje ou no futuro." };
    if (!/^\d{2}:\d{2}$/.test(time)) return { ok: false as const, error: "Escolha um horário." };
    if (data.partySize < 1 || data.partySize > 60)
      return { ok: false as const, error: "A quantidade de pessoas precisa estar entre 1 e 60." };

    const { publicClient } = await import("./public-client.server");
    const sb = publicClient();

    const { error } = await sb.from("reservations").insert({
      name: name.slice(0, 120),
      phone: phone.slice(0, 40),
      email: (data.email ?? "").trim().slice(0, 160) || null,
      party_size: Math.round(data.partySize),
      reserved_on: date,
      reserved_time: time,
      notes: (data.notes ?? "").trim().slice(0, 500) || null,
    });

    if (error) return { ok: false as const, error: "Não foi possível registrar agora. Tente novamente." };
    return { ok: true as const };
  });
