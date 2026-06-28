import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useAdminDashboard } from "../../src/hooks/useAdminDashboard";
import { MemberListItem } from "../../src/components/MemberListItem";

export default function MembersScreen() {
  const { members, loading } = useAdminDashboard();

  if (loading) {
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
      ListHeaderComponent={<Text style={styles.title}>Associados</Text>}
      ListEmptyComponent={<Text style={styles.muted}>Nenhum associado cadastrado ainda.</Text>}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 16, color: "#0f172a" },
  muted: { color: "#888", textAlign: "center", marginTop: 40 },
});
