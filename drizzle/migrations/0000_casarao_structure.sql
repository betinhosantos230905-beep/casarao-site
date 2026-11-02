-- Reservas
create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  party_size integer not null default 2,
  reserved_on date not null,
  reserved_time text not null,
  notes text,
  status text not null default 'pendente',
  created_at timestamptz not null default now(),
  constraint reservations_status_check check (status in ('pendente','confirmada','cancelada','concluida')),
  constraint reservations_party_check check (party_size between 1 and 60)
);
GRANT INSERT ON public.reservations TO anon;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
create policy "visitante pode registrar reserva" on public.reservations for insert to anon with check (true);

-- Itens do cardápio
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  image_url text,
  featured boolean not null default false,
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
create policy "cardapio visivel ao publico" on public.menu_items for select to anon using (true);

-- Fotos e logo do site
create table public.site_media (
  key text primary key,
  url text not null,
  alt text,
  updated_at timestamptz not null default now()
);
GRANT SELECT ON public.site_media TO anon;
GRANT ALL ON public.site_media TO service_role;
ALTER TABLE public.site_media ENABLE ROW LEVEL SECURITY;
create policy "fotos visiveis ao publico" on public.site_media for select to anon using (true);

-- Dados do restaurante
create table public.restaurant_info (
  id integer primary key default 1,
  name text not null default 'CASARÃO',
  subtitle text not null default 'Bar & Restaurante',
  tagline text,
  address text,
  phone text,
  whatsapp text,
  instagram text,
  hours_lunch text,
  hours_dinner text,
  constraint restaurant_info_single check (id = 1)
);
GRANT SELECT ON public.restaurant_info TO anon;
GRANT ALL ON public.restaurant_info TO service_role;
ALTER TABLE public.restaurant_info ENABLE ROW LEVEL SECURITY;
create policy "dados do restaurante visiveis ao publico" on public.restaurant_info for select to anon using (true);

-- Dados iniciais
insert into public.restaurant_info (id, name, subtitle, tagline) values (1, 'CASARÃO', 'Bar & Restaurante', 'Vassouras — RJ');

insert into public.site_media (key, url, alt) values
  ('logo', '/__l5e/assets-v1/47149be1-caee-4c99-a563-2cef8ac97c3b/casarao-logo.jpeg', 'CASARÃO Bar & Restaurante — Vassouras RJ'),
  ('hero', '/__l5e/assets-v1/dea5b6fc-7ab7-469d-93cd-48a33cf9a09a/picanha-na-chapa.jpeg', 'Picanha na chapa acompanhada de arroz de brócolis, fritas e farofa'),
  ('galeria_1', '/__l5e/assets-v1/42128951-99d2-4e4a-80de-a37bcc46bf6b/tabua-de-carnes.jpeg', 'Tábua de carnes com fritas, vinagrete e farofa ao lado de uma caneca de chopp'),
  ('galeria_2', '/__l5e/assets-v1/aba525bc-a601-492a-b9e6-821655820783/petit-gateau.jpeg', 'Petit gâteau aberto com sorvete de creme e folhas de hortelã'),
  ('galeria_3', '/__l5e/assets-v1/915e4f06-8507-460c-9258-428d64cd2d4e/pizza-calabresa.jpeg', 'Pizza calabresa com azeitonas pretas e orégano'),
  ('galeria_4', '/__l5e/assets-v1/f75e54ae-d66a-48e2-9beb-3f435f0eb911/vinho-servico.jpeg', 'Taça de vinho tinto sendo servida à mesa'),
  ('galeria_5', '/__l5e/assets-v1/47b1ead7-393c-419e-9dc7-eb6adaff2be2/filé-com-molho.jpeg', 'Filé ao molho branco com batatas chips e drink cítrico ao lado');

insert into public.menu_items (category, name, description, price, image_url, featured, sort_order) values
  ('entradas', 'Tábua de carnes do Casarão', 'Tiras de carne grelhada, empanados dourados, fritas, vinagrete e farofa', 96, '/__l5e/assets-v1/42128951-99d2-4e4a-80de-a37bcc46bf6b/tabua-de-carnes.jpeg', true, 1),
  ('entradas', 'Bolinho de mandioca', 'Recheado de queijo, com geleia de pimenta', 32, null, false, 2),
  ('entradas', 'Pastel de feira', 'Massa crocante de carne seca com queijo coalho', 34, null, false, 3),
  ('pratos', 'Picanha na chapa', 'Corte no ponto, arroz de brócolis, fritas e farofa', 118, '/__l5e/assets-v1/dea5b6fc-7ab7-469d-93cd-48a33cf9a09a/picanha-na-chapa.jpeg', true, 1),
  ('pratos', 'Filé ao molho branco', 'Tiras de filé em molho cremoso com batatas chips', 92, '/__l5e/assets-v1/47b1ead7-393c-419e-9dc7-eb6adaff2be2/filé-com-molho.jpeg', true, 2),
  ('pratos', 'Pizza calabresa', 'Calabresa, queijo derretido, azeitonas pretas e orégano', 78, '/__l5e/assets-v1/915e4f06-8507-460c-9258-428d64cd2d4e/pizza-calabresa.jpeg', false, 3),
  ('sobremesas', 'Petit gâteau', 'Recheio cremoso de chocolate com sorvete de creme', 32, '/__l5e/assets-v1/aba525bc-a601-492a-b9e6-821655820783/petit-gateau.jpeg', true, 1),
  ('sobremesas', 'Pudim de leite', 'Receita tradicional com calda de caramelo', 22, null, false, 2),
  ('bebidas', 'Chopp gelado', 'Tirado na hora, colarinho cremoso', 16, null, false, 1),
  ('bebidas', 'Vinho da casa (taça)', 'Tinto selecionado para acompanhar a carne', 24, '/__l5e/assets-v1/f75e54ae-d66a-48e2-9beb-3f435f0eb911/vinho-servico.jpeg', false, 2),
  ('bebidas', 'Drink cítrico da casa', 'Frutas frescas, gelo e alecrim', 32, null, false, 3),
  ('bebidas', 'Suco natural', 'Laranja, maracujá ou abacaxi com hortelã', 14, null, false, 4);