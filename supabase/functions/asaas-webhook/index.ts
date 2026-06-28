// Recebe eventos do Asaas (configurar a URL desta função no painel do Asaas).
// Valida um token compartilhado antes de processar e grava o pagamento de
// forma idempotente (asaas_payment_id é unique em `payments`).

import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const ASAAS_WEBHOOK_TOKEN = Deno.env.get("ASAAS_WEBHOOK_TOKEN");

interface AsaasWebhookPayload {
  event: string;
  payment: {
    id: string;
    value: number;
    paymentDate?: string;
    clientPaymentDate?: string;
  };
}

Deno.serve(async (req) => {
  const receivedToken = req.headers.get("asaas-access-token");
  if (!ASAAS_WEBHOOK_TOKEN || receivedToken !== ASAAS_WEBHOOK_TOKEN) {
    return new Response("Token inválido", { status: 401 });
  }

  const payload = (await req.json()) as AsaasWebhookPayload;
  const { event, payment } = payload;

  const { data: charge, error: chargeError } = await supabase
    .from("charges")
    .select("id")
    .eq("asaas_charge_id", payment.id)
    .maybeSingle();

  if (chargeError) {
    return new Response(`Erro ao buscar cobrança: ${chargeError.message}`, { status: 500 });
  }
  if (!charge) {
    // Evento de uma cobrança que não conhecemos - apenas confirma recebimento.
    return new Response("ok", { status: 200 });
  }

  if (event === "PAYMENT_CONFIRMED" || event === "PAYMENT_RECEIVED") {
    const paidAt = payment.clientPaymentDate ?? payment.paymentDate ?? new Date().toISOString();

    const { error: insertError } = await supabase
      .from("payments")
      .insert({
        charge_id: charge.id,
        asaas_payment_id: payment.id,
        amount_paid: payment.value,
        paid_at: paidAt,
        raw_payload: payload,
      })
      .select()
      .single();

    // Webhook idempotente: se já processamos esse asaas_payment_id, o unique
    // constraint rejeita o insert (código 23505) - não é um erro real.
    if (insertError && insertError.code !== "23505") {
      return new Response(`Erro ao gravar pagamento: ${insertError.message}`, { status: 500 });
    }

    await supabase.from("charges").update({ status: "paid", paid_at: paidAt }).eq("id", charge.id);
  } else if (event === "PAYMENT_OVERDUE") {
    await supabase.from("charges").update({ status: "overdue" }).eq("id", charge.id);
  }

  return new Response("ok", { status: 200 });
});
