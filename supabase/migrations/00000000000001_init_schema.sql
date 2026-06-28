-- Schema inicial: perfis, cobranças e pagamentos

create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null,
  cpf_cnpj text not null,
  role text not null default 'member' check (role in ('admin', 'member')),
  payment_method_preference text check (payment_method_preference in ('pix', 'boleto')),
  asaas_customer_id text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.charges (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  competence_month date not null,
  amount numeric(10, 2) not null,
  due_date date not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue', 'cancelled')),
  asaas_charge_id text,
  asaas_invoice_url text,
  pix_qr_code text,
  pix_copy_paste text,
  boleto_barcode text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  unique (member_id, competence_month)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  charge_id uuid not null references public.charges (id) on delete cascade,
  asaas_payment_id text not null unique,
  amount_paid numeric(10, 2) not null,
  paid_at timestamptz not null,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create index charges_member_id_idx on public.charges (member_id);
create index charges_competence_month_idx on public.charges (competence_month);
create index payments_charge_id_idx on public.payments (charge_id);

-- Cria automaticamente a linha em profiles quando um usuário se cadastra no Supabase Auth.
-- O role nunca é definido aqui como 'admin' - isso só é feito manualmente.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, cpf_cnpj, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'cpf_cnpj', ''),
    'member'
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
