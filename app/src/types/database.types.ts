// Tipos mínimos das tabelas/views usadas pelo app. Para tipos completos e
// sempre sincronizados com o schema, gere com:
// supabase gen types typescript --project-id <PROJECT_REF> > src/types/database.types.ts

export type ChargeStatus = "pending" | "paid" | "overdue" | "cancelled";
export type PaymentMethod = "pix" | "boleto";
export type UserRole = "admin" | "member";

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  cpf_cnpj: string;
  role: UserRole;
  payment_method_preference: PaymentMethod | null;
  asaas_customer_id: string | null;
  active: boolean;
  created_at: string;
}

export interface Charge {
  id: string;
  member_id: string;
  competence_month: string;
  amount: number;
  due_date: string;
  status: ChargeStatus;
  asaas_charge_id: string | null;
  asaas_invoice_url: string | null;
  pix_qr_code: string | null;
  pix_copy_paste: string | null;
  boleto_barcode: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface MemberSummary {
  member_id: string;
  full_name: string;
  phone: string;
  active: boolean;
  competence_month: string | null;
  amount: number | null;
  due_date: string | null;
  status: ChargeStatus | null;
  total_paid_lifetime: number;
}

export interface MonthlyCollected {
  month: string;
  total: number;
}

export interface DashboardKpis {
  total_collected_month: number;
  pending_value: number;
  default_rate: number;
  active_members: number;
}

export interface PeriodStatusCount {
  status: ChargeStatus;
  total: number;
}
