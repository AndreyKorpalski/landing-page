// Edge Function chamada pelo app (admin) para cadastrar um novo associado.
// verify_jwt fica true (padrão): o Supabase já garante um JWT válido; aqui
// confirmamos que esse JWT é de um admin antes de criar o usuário.
//
// O trigger handle_new_user (migration 1) cria a linha em `profiles` com
// role='member' a partir do user_metadata, então não inserimos em profiles aqui.

import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const jsonHeaders = { "Content-Type": "application/json" };

function fail(status: number, error: string) {
  return new Response(JSON.stringify({ error }), { status, headers: jsonHeaders });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return fail(405, "Método não permitido");
  }

  // 1. Identifica o chamador pelo JWT do header Authorization.
  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return fail(401, "Não autenticado");
  }

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData.user) {
    return fail(401, "Sessão inválida");
  }

  // 2. Confirma que o chamador é admin.
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profile?.role !== "admin") {
    return fail(403, "Apenas administradores podem cadastrar associados");
  }

  // 3. Valida o payload.
  let body: Record<string, string> | null = null;
  try {
    body = await req.json();
  } catch {
    return fail(400, "JSON inválido");
  }

  const full_name = body?.full_name?.trim();
  const email = body?.email?.trim();
  const password = body?.password;
  const cpf_cnpj = body?.cpf_cnpj?.trim();
  const phone = body?.phone?.trim();

  if (!full_name || !email || !password || !cpf_cnpj || !phone) {
    return fail(400, "Preencha nome, e-mail, senha, CPF e telefone");
  }
  if (password.length < 6) {
    return fail(400, "A senha deve ter ao menos 6 caracteres");
  }

  // 4. Cria o usuário; o trigger cria o profile (role=member) a partir do metadata.
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name, phone, cpf_cnpj },
  });

  if (createErr) {
    return fail(400, createErr.message);
  }

  return new Response(JSON.stringify({ id: created.user?.id }), { status: 200, headers: jsonHeaders });
});
