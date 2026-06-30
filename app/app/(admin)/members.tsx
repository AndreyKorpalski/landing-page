import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useAdminDashboard } from "../../src/hooks/useAdminDashboard";
import { MemberListItem } from "../../src/components/MemberListItem";
import { ScreenLayout } from "../../src/components/ScreenLayout";
import { theme } from "../../src/theme";

export default function MembersScreen() {
  const { members, loading, reload } = useAdminDashboard();
  const router = useRouter();

  // Recarrega ao voltar para a tela (ex.: após cadastrar um associado).
  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  const addButton = (
    <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(admin)/novo-associado")} hitSlop={8}>
      <Ionicons name="add" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <ScreenLayout title="Associados" subtitle="Membros da associação" right={addButton}>
      {loading && members.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.content}
          data={members}
          keyExtractor={(item) => item.member_id}
          renderItem={({ item }) => <MemberListItem member={item} />}
          ListEmptyComponent={<Text style={styles.muted}>Nenhum associado cadastrado ainda.</Text>}
        />
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  muted: { color: theme.textMuted, textAlign: "center", marginTop: 40 },
});
