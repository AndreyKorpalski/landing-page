-- Row Level Security: membros só veem seus próprios dados, admin vê tudo.
-- Escritas em charges/payments são bloqueadas para o cliente:
-- só as Edge Functions (service_role) escrevem nessas tabelas.

create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable set search_path = public;

alter table public.profiles enable row level security;
alter table public.charges enable row level security;
alter table public.payments enable row level security;

-- profiles
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "profiles_update_own_limited_fields"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- RLS por si só não restringe colunas: sem isto, um membro poderia
-- chamar update profiles set role='admin' on sua própria linha.
-- Este trigger trava role/asaas_customer_id/active contra qualquer
-- chamada que não seja via service_role (usado pelas Edge Functions).
create function public.protect_profile_admin_fields()
returns trigger as $$
begin
  if current_setting('request.jwt.claim.role', true) is distinct from 'service_role'
     and session_user <> 'postgres' then
    new.role := old.role;
    new.asaas_customer_id := old.asaas_customer_id;
    new.active := old.active;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger protect_profile_admin_fields_trigger
  before update on public.profiles
  for each row execute function public.protect_profile_admin_fields();

-- charges
create policy "charges_select_own_or_admin"
  on public.charges for select
  using (member_id = auth.uid() or public.is_admin());

-- nenhuma policy de insert/update/delete para 'authenticated' em charges:
-- por padrão (RLS habilitado sem policy correspondente) o acesso é negado.
-- Apenas o service_role (usado pelas Edge Functions) bypassa RLS.

-- payments
create policy "payments_select_own_or_admin"
  on public.payments for select
  using (
    exists (
      select 1 from public.charges c
      where c.id = payments.charge_id
        and (c.member_id = auth.uid() or public.is_admin())
    )
  );
