# Conta de Água — App da Associação

App mobile (React Native + Expo) para uma associação de água gerenciar cobranças mensais dos associados. Dois perfis de acesso:

- **Associação (admin)**: vê todos os associados, acompanha um dashboard com gráficos de arrecadação e status de pagamento.
- **Associado (membro)**: vê seu histórico de cobranças e escolhe a forma de pagamento (Pix ou boleto).

## Stack

- **Mobile**: React Native (Expo + expo-router)
- **Backend**: Supabase (Postgres, Auth, Edge Functions, RLS)
- **Pagamentos (Pix + Boleto)**: [Asaas](https://www.asaas.com)

## Estrutura

```
app/         # app Expo (React Native)
supabase/    # migrations e Edge Functions do Supabase
```

## Configuração

### 1. Supabase

```bash
npx supabase login
npx supabase link --project-ref <PROJECT_REF>
npx supabase db push          # aplica as migrations em supabase/migrations
```

Defina os secrets das Edge Functions (veja `supabase/.env.example`):

```bash
npx supabase secrets set --env-file supabase/.env
```

Crie manualmente o primeiro usuário admin (no SQL editor do Supabase, após o usuário se cadastrar via Auth):

```sql
update profiles set role = 'admin' where id = '<uuid-do-usuario>';
```

Para popular o app com dados de exemplo (um admin, três associados e cobranças em status variados, úteis para ver os gráficos preenchidos), use `supabase/seed_demo.sql` — as instruções estão no topo do arquivo.

Configure no painel do Asaas o webhook apontando para:
`https://<PROJECT_REF>.supabase.co/functions/v1/asaas-webhook`

Edite `supabase/migrations/00000000000004_schedule_monthly_charges.sql` com a URL do seu projeto e a chave antes de aplicar em produção (cria a cobrança mensal automaticamente via `pg_cron`).

### 2. App Expo

```bash
cd app
cp .env.example .env   # preencha EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY
npm install
npm run start
```

Abra no Expo Go (Android/iOS) ou em um simulador.

## Edge Functions

- `create-monthly-charges`: cria a cobrança (boleto + Pix) de cada associado ativo no Asaas, agendada mensalmente.
- `asaas-webhook`: recebe confirmação de pagamento do Asaas e atualiza o status da cobrança.

## Segurança

Toda escrita em `charges`/`payments` é bloqueada para o cliente via RLS — só as Edge Functions (com a service_role key) escrevem essas tabelas. As chaves do Asaas vivem só como secrets do Supabase, nunca no app.
