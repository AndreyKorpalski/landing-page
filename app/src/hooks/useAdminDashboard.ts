import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { DashboardKpis, MemberSummary, MonthlyCollected, PeriodStatusCount } from "../types/database.types";

export function useAdminDashboard() {
  const [kpis, setKpis] = useState<DashboardKpis | null>(null);
  const [periodSummary, setPeriodSummary] = useState<PeriodStatusCount[]>([]);
  const [monthlyCollected, setMonthlyCollected] = useState<MonthlyCollected[]>([]);
  const [members, setMembers] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const [kpisRes, periodRes, monthlyRes, membersRes] = await Promise.all([
      supabase.rpc("get_dashboard_kpis"),
      supabase.rpc("get_current_period_summary"),
      supabase.from("view_monthly_collected").select("*").order("month", { ascending: true }).limit(12),
      supabase.from("view_member_summary").select("*").order("full_name", { ascending: true }),
    ]);

    setKpis((kpisRes.data?.[0] as DashboardKpis) ?? null);
    setPeriodSummary((periodRes.data as PeriodStatusCount[]) ?? []);
    setMonthlyCollected((monthlyRes.data as MonthlyCollected[]) ?? []);
    setMembers((membersRes.data as MemberSummary[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { kpis, periodSummary, monthlyCollected, members, loading, reload };
}
