import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { DashboardKpis } from "../../types/database.types";
import { cardShadow, theme } from "../../theme";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function KpiRow({ kpis }: { kpis: DashboardKpis | null }) {
  if (!kpis) return null;

  const items: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
    { label: "Arrecadado no mês", value: formatCurrency(kpis.total_collected_month), icon: "cash-outline", color: theme.success },
    { label: "Inadimplência", value: `${kpis.default_rate}%`, icon: "alert-circle-outline", color: theme.warning },
    { label: "Valor pendente", value: formatCurrency(kpis.pending_value), icon: "hourglass-outline", color: theme.primary },
    { label: "Associados ativos", value: String(kpis.active_members), icon: "people-outline", color: theme.accent },
  ];

  return (
    <View style={styles.row}>
      {items.map((item) => (
        <View key={item.label} style={styles.card}>
          <View style={[styles.iconCircle, { backgroundColor: `${item.color}1a` }]}>
            <Ionicons name={item.icon} size={18} color={item.color} />
          </View>
          <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
            {item.value}
          </Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  card: {
    flexBasis: "47%",
    flexGrow: 1,
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    ...cardShadow,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  value: { fontSize: 19, fontWeight: "700", color: theme.text },
  label: { fontSize: 12, color: theme.textMuted, marginTop: 4 },
});
