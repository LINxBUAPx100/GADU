-- ∴ GADU — Configuración de Supabase
-- Ejecutar UNA VEZ en: Supabase Dashboard → SQL Editor → New query → pegar y Run

-- Tabla de templos: cada fila es una logia con todos sus usuarios y talleres
create table if not exists public.temples (
  id         uuid primary key default gen_random_uuid(),
  name       text not null unique,
  code       text not null,
  data       jsonb not null default '{"users":[],"meta":{}}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Seguridad a nivel de fila (obligatoria para exponer la tabla a la clave publicable)
alter table public.temples enable row level security;

-- Políticas: la app (clave publicable "anon") puede leer, crear y actualizar templos.
-- El acceso real se controla con el nombre + código de acceso del templo.
drop policy if exists "gadu leer templos" on public.temples;
create policy "gadu leer templos" on public.temples
  for select to anon using (true);

drop policy if exists "gadu crear templos" on public.temples;
create policy "gadu crear templos" on public.temples
  for insert to anon with check (true);

drop policy if exists "gadu actualizar templos" on public.temples;
create policy "gadu actualizar templos" on public.temples
  for update to anon using (true);

-- Permite al GADU demoler templos desde el panel de administración.
drop policy if exists "gadu borrar templos" on public.temples;
create policy "gadu borrar templos" on public.temples
  for delete to anon using (true);
