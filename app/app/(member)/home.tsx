import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSessionContext } from "../../src/context/SessionProvider";
import { useMemberCharges } from "../../src/hooks/useMemberCharges";
import { MemberStatusBadge } from "../../src/components/MemberStatusBadge";
import { ChargePaymentPanel } from "../../src/components/ChargePaymentPanel";
import { ScreenLayout } from "../../src/components/ScreenLayout";
import { cardShadow, theme } from "../../src/theme";

function formatMonth(competenceMonth: string) {
  return new Date(competenceMonth).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function MemberHomeScreen() {
  const { profile } = useSessionContext();
  const { currentCharge, loading, reload } = useMemberCharges(profile?.id);
  const router = useRouter();
  const firstName = profile?.full_name?.split(" ")[0] ?? "associado";

  return (
    <ScreenLayout title={`Olá, ${firstName}`} subtitle="Bem-vindo de volta">
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
        >
          {currentCharge ? (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{formatMonth(currentCharge.competence_month)}</Text>
                <MemberStatusBadge status={currentCharge.status} />
              </View>
              <Text style={styles.amount}>{formatCurrency(currentCharge.amount)}</Text>
              <View style={styles.dueRow}>
                <Ionicons name="calendar-outline" size={14} color={theme.textMuted} />
                <Text style={styles.dueDate}>
                  Vencimento: {new Date(currentCharge.due_date).toLocaleDateString("pt-BR")}
                </Text>
              </View>

              {currentCharge.status !== "paid" && currentCharge.status !== "cancelled" ? (
                <ChargePaymentPanel
                  charge={currentCharge}
                  preferredMethod={profile?.payment_method_preference ?? null}
                />
              ) : null}
            </View>
          ) : (
            <View style={styles.card}>
              <Ionicons name="receipt-outline" size={32} color={theme.textMuted} style={{ alignSelf: "center" }} />
              <Text style={styles.muted}>Nenhuma cobrança encontrada ainda.</Text>
            </View>
          )}

          <TouchableOpacity style={styles.historyLink} onPress={() => router.push("/(member)/historico")}>
            <Ionicons name="time-outline" size={18} color={theme.primary} />
            <Text style={styles.historyLinkText}>Ver histórico de pagamentos</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: theme.card, borderRadius: 16, padding: 20, ...cardShadow },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600", textTransform: "capitalize", color: theme.text },
  amount: { fontSize: 34, fontWeight: "700", marginTop: 12, color: theme.primary },
  dueRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  dueDate: { color: theme.textMuted },
  muted: { color: theme.textMuted, textAlign: "center", marginTop: 10 },
  historyLink: { marginTop: 20, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  historyLinkText: { color: theme.primary, fontWeight: "600" },
});
