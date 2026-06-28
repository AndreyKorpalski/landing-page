import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Charge } from "../types/database.types";

export function useMemberCharges(memberId: string | undefined) {
  const [charges, setCharges] = useState<Charge[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    const { data } = await supabase
      .from("charges")
      .select("*")
      .eq("member_id", memberId)
      .order("competence_month", { ascending: false });
    setCharges((data as Charge[]) ?? []);
    setLoading(false);
  }, [memberId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const currentCharge = charges.find((c) => c.status === "pending" || c.status === "overdue") ?? charges[0];

  return { charges, currentCharge, loading, reload };
}
