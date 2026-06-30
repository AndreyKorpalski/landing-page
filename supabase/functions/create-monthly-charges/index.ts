// Edge Function agendada (via pg_cron, ver migration 00000000000004) que cria
// a cobrança do mês para cada associado ativo: cliente no Asaas (se ainda não
// existir) + cobrança (boleto com Pix copia-e-cola embutido) + grava em `charges`.
//
// Usa a service_role key para escrever em `charges`, já que RLS bloqueia
// escrita direta de clientes nessa tabela por design.

import { createClient } from "jsr:@supabase/supabase-js@2";
import { createOrGetCustomer, createCharge, getPixQrCode } from "../_shared/asaasClient.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const DEFAULT_CHARGE_AMOUNT = Number(Deno.env.get("DEFAULT_CHARGE_AMOUNT") ?? "0");

Deno.serve(async () => {
  if (!DEFAULT_CHARGE_AMOUNT) {
    return new Response("DEFAULT_CHARGE_AMOUNT não configurado", { status: 500 });
  }

  const now = new Date();
  const competenceMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const dueDate = new Date(now.getFullYear(), now.getMonth(), 10);
  const competenceMonthStr = competenceMonth.toISOString().slice(0, 10);
  const dueDateStr = dueDate.toISOString().slice(0, 10);

  const { data: members, error: membersError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, asaas_customer_id, cpf_cnpj")
    .eq("role", "member")
    .eq("active", true);

  if (membersError) {
    return new Response(`Erro ao buscar associados: ${membersError.message}`, { status: 500 });
  }

  const results: Array<{ memberId: string; status: "created" | "skipped" | "failed"; detail?: string }> = [];

  for (const member of members ?? []) {
    try {
      const { data: existingCharge } = await supabase
        .from("charges")
        .select("id")
        .eq("member_id", member.id)
        .eq("competence_month", competenceMonthStr)
        .maybeSingle();

      if (existingCharge) {
        results.push({ memberId: member.id, status: "skipped", detail: "cobrança já existe" });
        continue;
      }

      let asaasCustomerId = member.asaas_customer_id as string | null;
      if (!asaasCustomerId) {
        const customer = await createOrGetCustomer({
          name: member.full_name,
          cpfCnpj: member.cpf_cnpj,
          phone: member.phone,
        });
        asaasCustomerId = customer.id;
        await supabase.from("profiles").update({ asaas_customer_id: asaasCustomerId }).eq("id", member.id);
      }

      const payment = await createCharge({
        customer: asaasCustomerId,
        value: DEFAULT_CHARGE_AMOUNT,
        dueDate: dueDateStr,
        description: `Conta de água - ${competenceMonthStr.slice(0, 7)}`,
      });

      const pix = await getPixQrCode(payment.id).catch(() => null);

      await supabase.from("charges").insert({
        member_id: member.id,
        competence_month: competenceMonthStr,
        amount: DEFAULT_CHARGE_AMOUNT,
        due_date: dueDateStr,
        status: "pending",
        asaas_charge_id: payment.id,
        asaas_invoice_url: payment.invoiceUrl,
        pix_qr_code: pix?.encodedImage ?? null,
        pix_copy_paste: pix?.payload ?? null,
        boleto_barcode: payment.bankSlipUrl ?? null,
      });

      results.push({ memberId: member.id, status: "created" });
    } catch (err) {
      results.push({ memberId: member.id, status: "failed", detail: (err as Error).message });
    }
  }

  return new Response(JSON.stringify({ competenceMonth: competenceMonthStr, results }), {
    headers: { "Content-Type": "application/json" },
  });
});
