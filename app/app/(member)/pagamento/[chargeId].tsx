import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../src/lib/supabase";
import { useSessionContext } from "../../../src/context/SessionProvider";
import { MemberStatusBadge } from "../../../src/components/MemberStatusBadge";
import { ChargePaymentPanel } from "../../../src/components/ChargePaymentPanel";
import type { Charge } from "../../../src/types/database.types";

function formatMonth(competenceMonth: string) {
  return new Date(competenceMonth).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function PagamentoDetalheScreen() {
  const { chargeId } = useLocalSearchParams<{ chargeId: string }>();
  const { profile } = useSessionContext();
  const [charge, setCharge] = useState<Charge | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chargeId) return;
    supabase
      .from("charges")
      .select("*")
      .eq("id", chargeId)
      .single()
      .then(({ data }) => {
        setCharge(data as Charge | null);
        setLoading(false);
      });
  }, [chargeId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!charge) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Cobrança não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{formatMonth(charge.competence_month)}</Text>
        <MemberStatusBadge status={charge.status} />
      </View>
      <Text style={styles.amount}>{formatCurrency(charge.amount)}</Text>
      <Text style={styles.dueDate}>Vencimento: {new Date(charge.due_date).toLocaleDateString("pt-BR")}</Text>

      <ChargePaymentPanel charge={charge} preferredMethod={profile?.payment_method_preference ?? null} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 18, fontWeight: "700", textTransform: "capitalize", color: "#0f172a" },
  amount: { fontSize: 32, fontWeight: "700", marginTop: 12, color: "#0369a1" },
  dueDate: { color: "#64748b", marginTop: 4 },
  muted: { color: "#888" },
});
