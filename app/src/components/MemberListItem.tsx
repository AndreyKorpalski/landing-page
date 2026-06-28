import { StyleSheet, Text, View } from "react-native";
import { MemberStatusBadge } from "./MemberStatusBadge";
import type { MemberSummary } from "../types/database.types";

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function MemberListItem({ member }: { member: MemberSummary }) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.name}>{member.full_name}</Text>
        <Text style={styles.meta}>
          {member.amount != null ? formatCurrency(member.amount) : "Sem cobrança"} · Total pago:{" "}
          {formatCurrency(member.total_paid_lifetime)}
        </Text>
      </View>
      <MemberStatusBadge status={member.status} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  info: { flex: 1, marginRight: 8 },
  name: { fontSize: 15, fontWeight: "600", color: "#0f172a" },
  meta: { fontSize: 12, color: "#64748b", marginTop: 2 },
});
