import { StyleSheet, Text, View } from "react-native";
import type { DashboardKpis } from "../../types/database.types";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function KpiRow({ kpis }: { kpis: DashboardKpis | null }) {
  if (!kpis) return null;

  const items = [
    { label: "Arrecadado este mês", value: formatCurrency(kpis.total_collected_month) },
    { label: "% Inadimplência", value: `${kpis.default_rate}%` },
    { label: "Valor pendente", value: formatCurrency(kpis.pending_value) },
    { label: "Associados ativos", value: String(kpis.active_members) },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    flexBasis: "47%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
  },
  value: { fontSize: 18, fontWeight: "700", color: "#0369a1" },
  label: { fontSize: 12, color: "#64748b", marginTop: 4 },
});
