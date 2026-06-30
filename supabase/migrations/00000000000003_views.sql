-- Views e funções que alimentam o dashboard do admin.
-- security_invoker garante que as views respeitam o RLS do usuário que consulta.

create view public.view_member_summary
  with (security_invoker = true) as
select
  p.id as member_id,
  p.full_name,
  p.phone,
  p.active,
  latest.competence_month,
  latest.amount,
  latest.due_date,
  latest.status,
  coalesce(paid_total.total_paid, 0) as total_paid_lifetime
from public.profiles p
left join lateral (
  select c.competence_month, c.amount, c.due_date, c.status
  from public.charges c
  where c.member_id = p.id
  order by c.competence_month desc
  limit 1
) latest on true
left join (
  select pay.member_id, sum(pay.amount_paid) as total_paid
  from (
    select c.member_id, pm.amount_paid
    from public.payments pm
    join public.charges c on c.id = pm.charge_id
  ) pay
  group by pay.member_id
) paid_total on paid_total.member_id = p.id
where p.role = 'member';

create view public.view_monthly_collected
  with (security_invoker = true) as
select
  date_trunc('month', pm.paid_at)::date as month,
  sum(pm.amount_paid) as total
from public.payments pm
group by 1
order by 1;

create function public.get_current_period_summary()
returns table (status text, total bigint)
language sql
security invoker
stable
as $$
  select status, count(*) as total
  from public.charges
  where competence_month = date_trunc('month', now())::date
  group by status;
$$;

create function public.get_dashboard_kpis()
returns table (
  total_collected_month numeric,
  pending_value numeric,
  default_rate numeric,
  active_members bigint
)
language sql
security invoker
stable
as $$
  select
    coalesce((
      select sum(pm.amount_paid)
      from public.payments pm
      where date_trunc('month', pm.paid_at) = date_trunc('month', now())
    ), 0) as total_collected_month,
    coalesce((
      select sum(c.amount)
      from public.charges c
      where c.competence_month = date_trunc('month', now())::date
        and c.status in ('pending', 'overdue')
    ), 0) as pending_value,
    coalesce((
      select round(
        100.0 * count(*) filter (where c.status in ('pending', 'overdue'))
        / greatest(count(*), 1), 1
      )
      from public.charges c
      where c.competence_month = date_trunc('month', now())::date
    ), 0) as default_rate,
    (select count(*) from public.profiles where role = 'member' and active = true) as active_members;
$$;
