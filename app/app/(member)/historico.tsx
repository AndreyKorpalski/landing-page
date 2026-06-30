import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSessionContext } from "../../src/context/SessionProvider";
import { useMemberCharges } from "../../src/hooks/useMemberCharges";
import { MemberStatusBadge } from "../../src/components/MemberStatusBadge";
import { ScreenLayout } from "../../src/components/ScreenLayout";
import { cardShadow, theme } from "../../src/theme";
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

  function renderItem({ item }: { item: Charge }) {
    return (
      <TouchableOpacity style={styles.row} onPress={() => router.push(`/(member)/pagamento/${item.id}`)}>
        <View style={{ flex: 1 }}>
          <Text style={styles.rowTitle}>{formatMonth(item.competence_month)}</Text>
          <Text style={styles.rowAmount}>{formatCurrency(item.amount)}</Text>
        </View>
        <MemberStatusBadge status={item.status} />
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    );
  }

  return (
    <ScreenLayout title="Histórico" subtitle="Suas cobranças">
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.content}
          data={charges}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.muted}>Nenhuma cobrança encontrada ainda.</Text>}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: {
    backgroundColor: theme.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    ...cardShadow,
  },
  rowTitle: { fontSize: 15, fontWeight: "600", textTransform: "capitalize", color: theme.text },
  rowAmount: { color: theme.textMuted, marginTop: 2 },
  muted: { color: theme.textMuted, textAlign: "center", marginTop: 40 },
});
