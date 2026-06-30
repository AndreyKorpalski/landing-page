import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../src/lib/supabase";
import { ScreenLayout } from "../../src/components/ScreenLayout";
import { cardShadow, theme } from "../../src/theme";

function currentCompetence() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

function defaultDueDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-10`;
}

interface MemberRow {
  id: string;
  full_name: string;
}

export default function GerarCobrancasScreen() {
  const router = useRouter();
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [competence, setCompetence] = useState(currentCompetence());
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [bulkValue, setBulkValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "member")
      .eq("active", true)
      .order("full_name")
      .then(({ data }) => {
        if (!active) return;
        setMembers((data as MemberRow[]) ?? []);
        setLoadingMembers(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function setAmount(id: string, value: string) {
    setAmounts((prev) => ({ ...prev, [id]: value }));
  }

  function applyToAll() {
    if (!bulkValue.trim()) return;
    const next: Record<string, string> = {};
    for (const m of members) next[m.id] = bulkValue;
    setAmounts(next);
  }

  async function handleSubmit() {
    const items = members
      .map((m) => ({ member_id: m.id, amount: Number((amounts[m.id] ?? "").replace(",", ".")) }))
      .filter((it) => Number.isFinite(it.amount) && it.amount > 0);

    if (items.length === 0) {
      Alert.alert("Informe ao menos um valor", "Digite o valor de pelo menos um associado.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("generate-charges", {
      body: { competence_month: competence, due_date: dueDate, items },
    });
    setSubmitting(false);

    if (error) {
      let message = error.message;
      try {
        const ctx = (error as { context?: Response }).context;
        if (ctx && typeof ctx.json === "function") {
          const parsed = await ctx.json();
          if (parsed?.error) message = parsed.error;
        }
      } catch {
        // mantém a mensagem padrão
      }
      Alert.alert("Não foi possível gerar", message);
      return;
    }

    const created = data?.created ?? 0;
    const skipped = data?.skipped ?? 0;
    Alert.alert(
      "Cobranças geradas",
      `${created} cobrança(s) criada(s).` + (skipped > 0 ? `\n${skipped} já existia(m) para este mês.` : ""),
    );
    router.back();
  }

  return (
    <ScreenLayout title="Gerar cobranças" back>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
            <Text style={styles.infoText}>
              Informe o valor de cada associado. Deixe em branco quem não vai ser cobrado neste mês. Quem já tem
              cobrança no mês é ignorado (não duplica).
            </Text>
          </View>

          <View style={styles.fieldRow}>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>Competência</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM"
                autoCapitalize="none"
                value={competence}
                onChangeText={setCompetence}
              />
            </View>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>Vencimento</Text>
              <TextInput
                style={styles.input}
                placeholder="AAAA-MM-DD"
                autoCapitalize="none"
                value={dueDate}
                onChangeText={setDueDate}
              />
            </View>
          </View>

          <Text style={styles.label}>Aplicar o mesmo valor a todos (opcional)</Text>
          <View style={styles.bulkRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Ex.: 50,00"
              keyboardType="decimal-pad"
              value={bulkValue}
              onChangeText={setBulkValue}
            />
            <TouchableOpacity style={styles.bulkButton} onPress={applyToAll}>
              <Text style={styles.bulkButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 20 }]}>Valor por associado (R$)</Text>
          {loadingMembers ? (
            <ActivityIndicator color={theme.primary} style={{ marginTop: 16 }} />
          ) : members.length === 0 ? (
            <Text style={styles.muted}>Nenhum associado ativo. Cadastre associados primeiro.</Text>
          ) : (
            members.map((m) => (
              <View key={m.id} style={styles.memberRow}>
                <Text style={styles.memberName} numberOfLines={1}>
                  {m.full_name}
                </Text>
                <TextInput
                  style={styles.memberInput}
                  placeholder="0,00"
                  keyboardType="decimal-pad"
                  value={amounts[m.id] ?? ""}
                  onChangeText={(v) => setAmount(m.id, v)}
                />
              </View>
            ))
          )}

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="cash-outline" size={18} color="#fff" />
                <Text style={styles.buttonText}>Gerar cobranças</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  infoText: { flex: 1, fontSize: 13, color: theme.primaryDark, lineHeight: 18 },
  fieldRow: { flexDirection: "row", gap: 12 },
  fieldHalf: { flex: 1 },
  label: { fontSize: 13, fontWeight: "600", color: theme.text, marginBottom: 6 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  bulkRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  bulkButton: {
    backgroundColor: theme.primaryLight,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  bulkButtonText: { color: "#fff", fontWeight: "700" },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.card,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 8,
    ...cardShadow,
  },
  memberName: { flex: 1, fontSize: 15, fontWeight: "600", color: theme.text, marginRight: 10 },
  memberInput: {
    width: 110,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 15,
    textAlign: "right",
  },
  muted: { color: theme.textMuted, marginTop: 8 },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
