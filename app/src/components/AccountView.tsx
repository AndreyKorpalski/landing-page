import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSessionContext } from "../context/SessionProvider";
import { supabase } from "../lib/supabase";
import { cardShadow, theme } from "../theme";

function initials(name: string | undefined) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "");
}

const PAYMENT_LABEL: Record<string, string> = { pix: "Pix", boleto: "Boleto" };

function InfoRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={theme.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export function AccountView() {
  const { profile, role, session } = useSessionContext();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials(profile?.full_name).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{profile?.full_name ?? "Usuário"}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{role === "admin" ? "Administrador" : "Associado"}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <InfoRow icon="mail-outline" label="E-mail" value={session?.user.email ?? "—"} />
        <View style={styles.divider} />
        <InfoRow icon="call-outline" label="Telefone" value={profile?.phone ?? "—"} />
        <View style={styles.divider} />
        <InfoRow icon="card-outline" label="CPF/CNPJ" value={profile?.cpf_cnpj ?? "—"} />
        {role === "member" ? (
          <>
            <View style={styles.divider} />
            <InfoRow
              icon="wallet-outline"
              label="Forma de pagamento preferida"
              value={
                profile?.payment_method_preference
                  ? PAYMENT_LABEL[profile.payment_method_preference]
                  : "Não definida"
              }
            />
          </>
        ) : null}
      </View>

      <TouchableOpacity style={styles.signOut} onPress={() => supabase.auth.signOut()}>
        <Ionicons name="log-out-outline" size={18} color={theme.danger} />
        <Text style={styles.signOutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  avatarBox: { alignItems: "center", marginBottom: 20 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    ...cardShadow,
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "700", color: theme.text, marginTop: 12 },
  roleBadge: {
    marginTop: 6,
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  roleText: { fontSize: 12, fontWeight: "700", color: theme.primaryDark },
  card: { backgroundColor: theme.card, borderRadius: 16, padding: 6, ...cardShadow },
  infoRow: { flexDirection: "row", alignItems: "center", padding: 12, gap: 12 },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { fontSize: 12, color: theme.textMuted },
  infoValue: { fontSize: 15, fontWeight: "600", color: theme.text, marginTop: 1 },
  divider: { height: 1, backgroundColor: theme.border, marginLeft: 62 },
  signOut: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#fef2f2",
  },
  signOutText: { color: theme.danger, fontWeight: "700", fontSize: 15 },
});
