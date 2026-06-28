import { StyleSheet, Text, View } from "react-native";
import type { ChargeStatus } from "../types/database.types";

const LABELS: Record<ChargeStatus, string> = {
  paid: "Pago",
  pending: "Pendente",
  overdue: "Atrasado",
  cancelled: "Cancelado",
};

const COLORS: Record<ChargeStatus, { bg: string; text: string }> = {
  paid: { bg: "#dcfce7", text: "#15803d" },
  pending: { bg: "#fef9c3", text: "#a16207" },
  overdue: { bg: "#fee2e2", text: "#b91c1c" },
  cancelled: { bg: "#e5e7eb", text: "#4b5563" },
};

export function MemberStatusBadge({ status }: { status: ChargeStatus | null }) {
  if (!status) return null;
  const colors = COLORS[status];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{LABELS[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { borderRadius: 12, paddingVertical: 4, paddingHorizontal: 10 },
  text: { fontSize: 12, fontWeight: "600" },
});
