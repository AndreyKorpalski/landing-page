import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAdminDashboard } from "../../src/hooks/useAdminDashboard";
import { KpiRow } from "../../src/components/charts/KpiRow";
import { PaidVsUnpaidDonut } from "../../src/components/charts/PaidVsUnpaidDonut";
import { CollectedTrendLine } from "../../src/components/charts/CollectedTrendLine";
import { ScreenLayout } from "../../src/components/ScreenLayout";
import { theme } from "../../src/theme";

export default function AdminDashboardScreen() {
  const { kpis, periodSummary, monthlyCollected, loading, reload } = useAdminDashboard();
  const router = useRouter();

  return (
    <ScreenLayout title="Dashboard" subtitle="Visão geral da associação">
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={false} onRefresh={reload} />}
        >
          <KpiRow kpis={kpis} />
          <PaidVsUnpaidDonut data={periodSummary} />
          <CollectedTrendLine data={monthlyCollected} />

          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/(admin)/gerar-cobrancas")}>
            <Ionicons name="cash-outline" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}>Gerar cobranças do mês</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/(admin)/members")}>
            <Ionicons name="people-outline" size={18} color={theme.primary} />
            <Text style={styles.secondaryButtonText}>Ver lista de associados</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  primaryButton: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  secondaryButton: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  secondaryButtonText: { color: theme.primary, fontWeight: "700", fontSize: 15 },
});
