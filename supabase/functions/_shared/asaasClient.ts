// Cliente mínimo para a API do Asaas (https://docs.asaas.com).
// A chave de API nunca deve ser exposta ao app mobile - vive só como secret
// da Edge Function (ASAAS_API_KEY).

const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
const ASAAS_BASE_URL = Deno.env.get("ASAAS_BASE_URL") ?? "https://api.asaas.com/v3";

if (!ASAAS_API_KEY) {
  throw new Error("ASAAS_API_KEY não configurada nos secrets da Edge Function");
}

async function asaasRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${ASAAS_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      access_token: ASAAS_API_KEY!,
      ...init.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Asaas ${path} falhou (${response.status}): ${body}`);
  }

  return response.json() as Promise<T>;
}

export interface AsaasCustomer {
  id: string;
  name: string;
  cpfCnpj: string;
  phone?: string;
}

export interface AsaasPayment {
  id: string;
  invoiceUrl: string;
  bankSlipUrl?: string;
  status: string;
  pixTransaction?: { qrCode?: { encodedImage?: string; payload?: string } };
}

export async function createOrGetCustomer(params: {
  name: string;
  cpfCnpj: string;
  phone: string;
}): Promise<AsaasCustomer> {
  return asaasRequest<AsaasCustomer>("/customers", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function createCharge(params: {
  customer: string;
  value: number;
  dueDate: string; // YYYY-MM-DD
  description?: string;
}): Promise<AsaasPayment> {
  return asaasRequest<AsaasPayment>("/payments", {
    method: "POST",
    body: JSON.stringify({
      customer: params.customer,
      billingType: "BOLETO", // Asaas também gera o Pix copia-e-cola junto do boleto
      value: params.value,
      dueDate: params.dueDate,
      description: params.description,
    }),
  });
}

export async function getPixQrCode(paymentId: string): Promise<{ encodedImage: string; payload: string }> {
  return asaasRequest(`/payments/${paymentId}/pixQrCode`);
}
