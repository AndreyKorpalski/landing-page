-- Agenda a criação mensal de cobranças via pg_cron, chamando a Edge Function
-- create-monthly-charges no dia 1 de cada mês às 06:00 (horário do servidor, UTC).
--
-- IMPORTANTE: troque <PROJECT_REF> e <ANON_OR_SERVICE_KEY> pelos valores reais
-- do seu projeto Supabase antes de aplicar esta migration em produção.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'create-monthly-charges',
  '0 6 1 * *',
  $$
  select net.http_post(
    url := 'https://<PROJECT_REF>.supabase.co/functions/v1/create-monthly-charges',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <ANON_OR_SERVICE_KEY>'
    ),
    body := '{}'::jsonb
  );
  $$
);
