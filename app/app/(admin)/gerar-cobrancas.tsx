import { useState } from "react";
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

export default function GerarCobrancasScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [competence, setCompetence] = useState(currentCompetence());
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    const parsedAmount = Number(amount.replace(",", "."));
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert("Informe um valor válido", "Ex.: 50 ou 49,90");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.functions.invoke("generate-charges", {
      body: { competence_month: competence, due_date: dueDate, amount: parsedAmount },
    });
    setLoading(false);

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
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
            <Text style={styles.infoText}>
              Cria a cobrança do mês para todos os associados ativos. Quem já tem cobrança neste mês é ignorado
              (não duplica).
            </Text>
          </View>

          <Text style={styles.label}>Valor (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex.: 50,00"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Mês de competência</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM"
            autoCapitalize="none"
            value={competence}
            onChangeText={setCompetence}
          />

          <Text style={styles.label}>Vencimento</Text>
          <TextInput
            style={styles.input}
            placeholder="AAAA-MM-DD"
            autoCapitalize="none"
            value={dueDate}
            onChangeText={setDueDate}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
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
  label: { fontSize: 13, fontWeight: "600", color: theme.text, marginBottom: 6 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    ...cardShadow,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
