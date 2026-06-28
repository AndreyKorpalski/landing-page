import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useSessionContext } from "../../src/context/SessionProvider";
import { useMemberCharges } from "../../src/hooks/useMemberCharges";
import { MemberStatusBadge } from "../../src/components/MemberStatusBadge";
import { ChargePaymentPanel } from "../../src/components/ChargePaymentPanel";
import { supabase } from "../../src/lib/supabase";

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
    >
      <Text style={styles.greeting}>Olá, {profile?.full_name?.split(" ")[0] ?? "associado"}</Text>

      {currentCharge ? (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{formatMonth(currentCharge.competence_month)}</Text>
            <MemberStatusBadge status={currentCharge.status} />
          </View>
          <Text style={styles.amount}>{formatCurrency(currentCharge.amount)}</Text>
          <Text style={styles.dueDate}>
            Vencimento: {new Date(currentCharge.due_date).toLocaleDateString("pt-BR")}
          </Text>

          {currentCharge.status !== "paid" && currentCharge.status !== "cancelled" ? (
            <ChargePaymentPanel charge={currentCharge} preferredMethod={profile?.payment_method_preference ?? null} />
          ) : null}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.muted}>Nenhuma cobrança encontrada ainda.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.historyLink} onPress={() => router.push("/(member)/historico")}>
        <Text style={styles.historyLinkText}>Ver histórico de pagamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signOutButton} onPress={() => supabase.auth.signOut()}>
        <Text style={styles.signOutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  greeting: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: "#0f172a" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 20, shadowOpacity: 0.05, shadowRadius: 8 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600", textTransform: "capitalize", color: "#0f172a" },
  amount: { fontSize: 32, fontWeight: "700", marginTop: 12, color: "#0369a1" },
  dueDate: { color: "#64748b", marginTop: 4 },
  muted: { color: "#888", textAlign: "center" },
  historyLink: { marginTop: 20, alignItems: "center" },
  historyLinkText: { color: "#0369a1", fontWeight: "600" },
  signOutButton: { marginTop: 24, alignItems: "center" },
  signOutText: { color: "#b91c1c", fontWeight: "600" },
});
