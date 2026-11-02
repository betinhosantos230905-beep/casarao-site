export type Category = "entradas" | "pratos" | "sobremesas" | "bebidas";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "entradas", label: "Entradas" },
  { id: "pratos", label: "Pratos" },
  { id: "sobremesas", label: "Sobremesas" },
  { id: "bebidas", label: "Bebidas" },
];

export type MenuItem = {
  id: string;
  category: Category;
  name: string;
  description: string | null;
  price: number | string;
  image_url: string | null;
  featured: boolean;
  available: boolean;
  sort_order: number;
};

export type MediaItem = { key: string; url: string; alt: string | null };

export type RestaurantInfo = {
  name: string;
  subtitle: string;
  tagline: string | null;
  address: string | null;
  phone: string | null;
  whatsapp: string | null;
  instagram: string | null;
  hours_lunch: string | null;
  hours_dinner: string | null;
};

export type Reservation = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  party_size: number;
  reserved_on: string;
  reserved_time: string;
  notes: string | null;
  status: "pendente" | "confirmada" | "cancelada" | "concluida";
  created_at: string;
};

export const brl = (n: number | string) =>
  Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const dateBR = (iso: string) => {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};
