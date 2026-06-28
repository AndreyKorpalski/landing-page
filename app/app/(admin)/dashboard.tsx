import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAdminDashboard } from "../../src/hooks/useAdminDashboard";
import { KpiRow } from "../../src/components/charts/KpiRow";
import { PaidVsUnpaidDonut } from "../../src/components/charts/PaidVsUnpaidDonut";
import { CollectedTrendLine } from "../../src/components/charts/CollectedTrendLine";
import { supabase } from "../../src/lib/supabase";

export default function AdminDashboardScreen() {
  const { kpis, periodSummary, monthlyCollected, loading, reload } = useAdminDashboard();
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
      <Text style={styles.title}>Dashboard da associação</Text>

      <KpiRow kpis={kpis} />
      <PaidVsUnpaidDonut data={periodSummary} />
      <CollectedTrendLine data={monthlyCollected} />

      <TouchableOpacity style={styles.membersButton} onPress={() => router.push("/(admin)/members")}>
        <Text style={styles.membersButtonText}>Ver lista de associados</Text>
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
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#0f172a" },
  membersButton: {
    backgroundColor: "#0369a1",
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  membersButtonText: { color: "#fff", fontWeight: "600" },
  signOutButton: { marginTop: 20, alignItems: "center" },
  signOutText: { color: "#b91c1c", fontWeight: "600" },
});
