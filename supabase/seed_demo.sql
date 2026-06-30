-- =============================================================================
-- DADOS DE TESTE (DEMO) - rodar manualmente no SQL Editor do Supabase
-- =============================================================================
--
-- PRÉ-REQUISITO: como profiles depende de auth.users, primeiro crie 4 usuários
-- no painel  Authentication > Users > Add user  (defina uma senha para cada):
--
--     admin@agua.test
--     joao@agua.test
--     maria@agua.test
--     pedro@agua.test
--
-- Ao criar cada usuário, o trigger handle_new_user já cria a linha em profiles
-- automaticamente (como 'member'). Este script então preenche nome/telefone,
-- promove o admin e insere cobranças + pagamentos de exemplo.
--
-- Pode rodar mais de uma vez sem duplicar (usa ON CONFLICT).
-- Para limpar os dados de teste depois, veja o bloco comentado no fim.
-- =============================================================================

do $$
declare
  v_admin uuid;
  v_joao  uuid;
  v_maria uuid;
  v_pedro uuid;
  v_amount numeric := 50.00;
  m0 date := date_trunc('month', now())::date;                       -- mês atual
  m1 date := (date_trunc('month', now()) - interval '1 month')::date; -- mês anterior
  m2 date := (date_trunc('month', now()) - interval '2 month')::date; -- 2 meses atrás
begin
  select id into v_admin from auth.users where email = 'admin@agua.test';
  select id into v_joao  from auth.users where email = 'joao@agua.test';
  select id into v_maria from auth.users where email = 'maria@agua.test';
  select id into v_pedro from auth.users where email = 'pedro@agua.test';

  if v_admin is null or v_joao is null or v_maria is null or v_pedro is null then
    raise exception
      'Crie primeiro os 4 usuários no painel Authentication > Users: admin@agua.test, joao@agua.test, maria@agua.test, pedro@agua.test';
  end if;

  -- O trigger de proteção impede alterar role/active diretamente; desabilita
  -- temporariamente só para semear os dados de teste.
  alter table public.profiles disable trigger protect_profile_admin_fields_trigger;

  update public.profiles
    set full_name = 'Associação Água Boa', phone = '5599999990000', cpf_cnpj = '00000000000',
        role = 'admin', active = true
    where id = v_admin;

  update public.profiles
    set full_name = 'João da Silva', phone = '5599999990001', cpf_cnpj = '11111111111',
        role = 'member', payment_method_preference = 'pix', active = true
    where id = v_joao;

  update public.profiles
    set full_name = 'Maria Souza', phone = '5599999990002', cpf_cnpj = '22222222222',
        role = 'member', payment_method_preference = 'boleto', active = true
    where id = v_maria;

  update public.profiles
    set full_name = 'Pedro Santos', phone = '5599999990003', cpf_cnpj = '33333333333',
        role = 'member', payment_method_preference = 'pix', active = true
    where id = v_pedro;

  alter table public.profiles enable trigger protect_profile_admin_fields_trigger;

  -- Cobranças. No mês atual deixamos os três status diferentes (alimenta o
  -- gráfico de rosca); nos meses anteriores tudo pago (alimenta a linha de
  -- arrecadação e o "total pago" de cada associado).
  insert into public.charges (member_id, competence_month, amount, due_date, status, paid_at) values
    -- mês atual
    (v_joao,  m0, v_amount, m0 + 9, 'paid',    now()),
    (v_maria, m0, v_amount, m0 + 9, 'overdue', null),
    (v_pedro, m0, v_amount, m0 + 9, 'pending', null),
    -- mês anterior (todos pagos)
    (v_joao,  m1, v_amount, m1 + 9, 'paid', (m1 + 7)::timestamptz),
    (v_maria, m1, v_amount, m1 + 9, 'paid', (m1 + 8)::timestamptz),
    (v_pedro, m1, v_amount, m1 + 9, 'paid', (m1 + 6)::timestamptz),
    -- 2 meses atrás
    (v_joao,  m2, v_amount, m2 + 9, 'paid', (m2 + 5)::timestamptz),
    (v_maria, m2, v_amount, m2 + 9, 'paid', (m2 + 7)::timestamptz)
  on conflict (member_id, competence_month) do nothing;

  -- Um pagamento para cada cobrança paga (alimenta KPIs e o gráfico de arrecadação).
  insert into public.payments (charge_id, asaas_payment_id, amount_paid, paid_at)
  select c.id, 'seed-' || c.id, c.amount, coalesce(c.paid_at, (c.competence_month + 7)::timestamptz)
  from public.charges c
  where c.status = 'paid'
  on conflict (asaas_payment_id) do nothing;

  raise notice 'Dados de teste criados com sucesso.';
end $$;

-- =============================================================================
-- LIMPAR os dados de teste (descomente e rode se quiser remover):
-- =============================================================================
-- delete from public.payments where asaas_payment_id like 'seed-%';
-- delete from public.charges  where member_id in (
--   select id from public.profiles where cpf_cnpj in
--     ('00000000000','11111111111','22222222222','33333333333'));
-- (os usuários em auth.users você remove pelo painel Authentication > Users)
