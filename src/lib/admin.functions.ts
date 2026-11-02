import { createServerFn } from "@tanstack/react-start";
import type { MediaItem, MenuItem, RestaurantInfo, Reservation } from "@/lib/types";

// Every function below checks the admin session first, then loads the
// privileged client — both with await import() inside the handler body, so
// neither the session module nor the service-role client reaches the browser.
async function adminClient() {
  const { requireUnlocked } = await import("./session.server");
  await requireUnlocked();
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export const listReservations = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await adminClient();
  const { data, error } = await sb
    .from("reservations")
    .select("*")
    .order("reserved_on", { ascending: true })
    .order("reserved_time", { ascending: true });
 if (error) {
  console.error("[CASARAO] Erro ao carregar reservas:", error);
  throw new Error(`Erro ao carregar reservas: ${error.message}`);
}
  return (data as Reservation[] | null) ?? [];
});

export const setReservationStatus = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; status: Reservation["status"] }) => data)
  .handler(async ({ data }) => {
    const sb = await adminClient();
    const allowed: Reservation["status"][] = ["pendente", "confirmada", "cancelada", "concluida"];
    if (!allowed.includes(data.status)) return { ok: false as const };
    const { error } = await sb.from("reservations").update({ status: data.status }).eq("id", data.id);
    return { ok: !error } as const;
  });

export const deleteReservation = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const sb = await adminClient();
    const { error } = await sb.from("reservations").delete().eq("id", data.id);
    return { ok: !error } as const;
  });

export const listMenuItems = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await adminClient();
  const { data, error } = await sb.from("menu_items").select("*").order("category").order("sort_order");
  if (error) throw new Error("Não foi possível carregar o cardápio");
  return (data as MenuItem[] | null) ?? [];
});

type MenuItemDraft = {
  id?: string | undefined;
  category: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  featured: boolean;
  available: boolean;
  sort_order: number;
};

export const saveMenuItem = createServerFn({ method: "POST" })
  .inputValidator((data: { item: MenuItemDraft }) => data)
  .handler(async ({ data }) => {
    const sb = await adminClient();
    const item = data.item;
    if (!item.name?.trim() || !item.category) return { ok: false as const, error: "Nome e categoria são obrigatórios." };
    if (!(Number(item.price) >= 0)) return { ok: false as const, error: "Preço inválido." };

    const payload = {
      category: item.category,
      name: item.name.trim().slice(0, 120),
      description: (item.description ?? "").trim().slice(0, 400) || null,
      price: Number(item.price),
      image_url: item.image_url?.slice(0, 500) || null,
      featured: Boolean(item.featured),
      available: item.available !== false,
      sort_order: Number(item.sort_order) || 0,
    };

    if (item.id) {
      const { error } = await sb.from("menu_items").update(payload).eq("id", item.id);
      if (error) return { ok: false as const, error: "Não foi possível salvar." };
    } else {
      const { error } = await sb.from("menu_items").insert(payload);
      if (error) return { ok: false as const, error: "Não foi possível adicionar." };
    }
    return { ok: true as const };
  });

export const deleteMenuItem = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const sb = await adminClient();
    const { error } = await sb.from("menu_items").delete().eq("id", data.id);
    return { ok: !error } as const;
  });

export const getRestaurantInfo = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await adminClient();
  const { data } = await sb.from("restaurant_info").select("*").eq("id", 1).maybeSingle();
  return (data as RestaurantInfo | null) ?? null;
});

export const saveRestaurantInfo = createServerFn({ method: "POST" })
  .inputValidator((data: { info: RestaurantInfo }) => data)
  .handler(async ({ data }) => {
    const sb = await adminClient();
    const i = data.info;
    const { error } = await sb
      .from("restaurant_info")
      .upsert({
        id: 1,
        name: (i.name || "CASARÃO").trim().slice(0, 80),
        subtitle: (i.subtitle || "Bar & Restaurante").trim().slice(0, 80),
        tagline: (i.tagline ?? "").trim().slice(0, 160) || null,
        address: (i.address ?? "").trim().slice(0, 200) || null,
        phone: (i.phone ?? "").trim().slice(0, 40) || null,
        whatsapp: (i.whatsapp ?? "").trim().slice(0, 40) || null,
        instagram: (i.instagram ?? "").trim().slice(0, 60) || null,
        hours_lunch: (i.hours_lunch ?? "").trim().slice(0, 80) || null,
        hours_dinner: (i.hours_dinner ?? "").trim().slice(0, 80) || null,
      });
    return { ok: !error } as const;
  });

export const listMedia = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await adminClient();
  const { data } = await sb.from("site_media").select("key, url, alt").order("key");
  return (data as MediaItem[] | null) ?? [];
});

export const setMedia = createServerFn({ method: "POST" })
  .inputValidator((data: { key: string; url: string; alt?: string }) => data)
  .handler(async ({ data }) => {
    const sb = await adminClient();

    const { data: existing } = await sb.from("site_media").select("url").eq("key", data.key).maybeSingle();

    const { error } = await sb.from("site_media").upsert({
      key: data.key,
      url: data.url.slice(0, 500),
      alt: (data.alt ?? "").trim().slice(0, 200) || null,
      updated_at: new Date().toISOString(),
    });

    // Drop the file the new one replaced so storage does not fill with orphans.
    if (!error && existing?.url?.startsWith("/api/public/media/")) {
      const oldPath = decodeURIComponent(existing.url.slice("/api/public/media/".length));
      if (oldPath && !data.url.includes(oldPath)) {
        await sb.storage.from("site-media").remove([oldPath]);
      }
    }

    return { ok: !error } as const;
  });
