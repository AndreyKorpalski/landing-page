import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useAdminDashboard } from "../../src/hooks/useAdminDashboard";
import { MemberListItem } from "../../src/components/MemberListItem";

export default function MembersScreen() {
  const { members, loading, reload } = useAdminDashboard();
  const router = useRouter();

  // Recarrega ao voltar para a tela (ex.: após cadastrar um associado).
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  // Spinner de tela cheia só no carregamento inicial; nas recargas a lista permanece.
  if (loading && members.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={members}
      keyExtractor={(item) => item.member_id}
      renderItem={({ item }) => <MemberListItem member={item} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Associados</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(admin)/novo-associado")}>
            <Text style={styles.addButtonText}>+ Novo associado</Text>
          </TouchableOpacity>
        </View>
      }
      ListEmptyComponent={<Text style={styles.muted}>Nenhum associado cadastrado ainda.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  addButton: {
    backgroundColor: "#0369a1",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  muted: { color: "#888", textAlign: "center", marginTop: 40 },
});
