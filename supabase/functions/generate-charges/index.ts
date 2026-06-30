// Edge Function chamada pelo app (admin) para gerar manualmente a cobrança de
// um mês para todos os associados ativos — versão sem Asaas (apenas registra a
// cobrança no banco: valor, vencimento e status 'pending').
//
// Escrita em `charges` é bloqueada para o cliente via RLS; por isso a criação
// passa por aqui, usando a service_role. Quando a integração do Asaas entrar,
// é esta função (ou a agendada) que vai preencher boleto/Pix nas cobranças.

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const jsonHeaders = { "Content-Type": "application/json" };

function fail(status: number, error: string) {
  return new Response(JSON.stringify({ error }), { status, headers: jsonHeaders });
}

// Aceita "AAAA-MM" ou "AAAA-MM-DD" e devolve o primeiro dia do mês (AAAA-MM-01).
function normalizeCompetence(value: string): string | null {
  const m = value.match(/^(\d{4})-(\d{2})/);
  if (!m) return null;
  const month = Number(m[2]);
  if (month < 1 || month > 12) return null;
  return `${m[1]}-${m[2]}-01`;
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00`);
  return !Number.isNaN(d.getTime());
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return fail(405, "Método não permitido");
  }

  // 1. Identifica o chamador e confirma que é admin.
  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
  if (!token) return fail(401, "Não autenticado");

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData.user) return fail(401, "Sessão inválida");

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    return fail(403, "Apenas administradores podem gerar cobranças");
  }

  // 2. Valida o payload.
  let body: Record<string, unknown> | null = null;
  try {
    body = await req.json();
  } catch {
    return fail(400, "JSON inválido");
  }

  const competence = normalizeCompetence(String(body?.competence_month ?? ""));
  if (!competence) return fail(400, "Mês de competência inválido (use AAAA-MM)");

  const dueDate = String(body?.due_date ?? "");
  if (!isValidDate(dueDate)) return fail(400, "Data de vencimento inválida (use AAAA-MM-DD)");

  const amount = Number(body?.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return fail(400, "Informe um valor maior que zero");
  }

  // 3. Busca os associados ativos.
  const { data: members, error: membersErr } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "member")
    .eq("active", true);

  if (membersErr) return fail(400, membersErr.message);
  if (!members || members.length === 0) {
    return fail(400, "Nenhum associado ativo encontrado");
  }

  // 4. Monta uma cobrança por associado e insere ignorando duplicados
  //    (constraint unique member_id + competence_month evita cobrar 2x o mesmo mês).
  const rows = members.map((m) => ({
    member_id: m.id,
    competence_month: competence,
    amount,
    due_date: dueDate,
    status: "pending",
  }));

  const { data: inserted, error: insertErr } = await admin
    .from("charges")
    .upsert(rows, { onConflict: "member_id,competence_month", ignoreDuplicates: true })
    .select("id");

  if (insertErr) return fail(400, insertErr.message);

  const created = inserted?.length ?? 0;
  return new Response(
    JSON.stringify({ created, skipped: rows.length - created, total_members: rows.length }),
    { status: 200, headers: jsonHeaders },
  );
});
