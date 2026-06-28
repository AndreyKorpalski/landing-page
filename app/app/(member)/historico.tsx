import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useSessionContext } from "../../src/context/SessionProvider";
import { useMemberCharges } from "../../src/hooks/useMemberCharges";
import { MemberStatusBadge } from "../../src/components/MemberStatusBadge";
import type { Charge } from "../../src/types/database.types";

function formatMonth(competenceMonth: string) {
  return new Date(competenceMonth).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function HistoricoScreen() {
  const { profile } = useSessionContext();
  const { charges, loading } = useMemberCharges(profile?.id);
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  function renderItem({ item }: { item: Charge }) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => router.push(`/(member)/pagamento/${item.id}`)}>
        <View>
          <Text style={styles.rowTitle}>{formatMonth(item.competence_month)}</Text>
          <Text style={styles.rowAmount}>{formatCurrency(item.amount)}</Text>
        </View>
        <MemberStatusBadge status={item.status} />
      </TouchableOpacity>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={charges}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={<Text style={styles.title}>Histórico de pagamentos</Text>}
      ListEmptyComponent={<Text style={styles.muted}>Nenhuma cobrança encontrada ainda.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#0f172a" },
  row: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowTitle: { fontSize: 15, fontWeight: "600", textTransform: "capitalize", color: "#0f172a" },
  rowAmount: { color: "#64748b", marginTop: 2 },
  muted: { color: "#888", textAlign: "center", marginTop: 40 },
});
