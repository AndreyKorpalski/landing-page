import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import type { ChargeStatus, PeriodStatusCount } from "../../types/database.types";
import { cardShadow } from "../../theme";

const COLORS: Record<ChargeStatus, string> = {
  paid: "#22c55e",
  pending: "#eab308",
  overdue: "#ef4444",
  cancelled: "#94a3b8",
};

const LABELS: Record<ChargeStatus, string> = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Atrasado",
  cancelled: "Cancelado",
};

export function PaidVsUnpaidDonut({ data }: { data: PeriodStatusCount[] }) {
  const total = data.reduce((sum, item) => sum + item.total, 0);

  const pieData = data.map((item) => ({
    value: item.total,
    color: COLORS[item.status],
    text: `${item.total}`,
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pago vs pendente vs atrasado (mês atual)</Text>
      {total > 0 ? (
        <View style={styles.chartRow}>
          <PieChart donut radius={70} innerRadius={45} data={pieData} centerLabelComponent={() => (
            <Text style={styles.centerLabel}>{total}</Text>
          )} />
          <View style={styles.legend}>
            {data.map((item) => (
              <View key={item.status} style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: COLORS[item.status] }]} />
                <Text style={styles.legendText}>
                  {LABELS[item.status]}: {item.total}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.muted}>Sem cobranças neste mês ainda.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginTop: 12, ...cardShadow },
  title: { fontSize: 14, fontWeight: "600", color: "#0f172a", marginBottom: 12 },
  chartRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  centerLabel: { fontSize: 16, fontWeight: "700", color: "#0f172a" },
  legend: { gap: 6 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: "#475569" },
  muted: { color: "#888" },
});
