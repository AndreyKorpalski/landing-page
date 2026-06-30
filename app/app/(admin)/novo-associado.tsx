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
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "../../src/lib/supabase";
import { ScreenLayout } from "../../src/components/ScreenLayout";
import { theme } from "../../src/theme";

export default function NovoAssociadoScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!fullName || !email || !cpfCnpj || !phone || !password) {
      Alert.alert("Preencha todos os campos");
      return;
    }

    setLoading(true);
    const { error } = await supabase.functions.invoke("create-member", {
      body: {
        full_name: fullName,
        email,
        cpf_cnpj: cpfCnpj,
        phone,
        password,
      },
    });
    setLoading(false);

    if (error) {
      // Erros HTTP (403/400/...) chegam como FunctionsHttpError com a Response
      // em error.context; extraímos a mensagem de negócio que a função retornou.
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
      Alert.alert("Não foi possível cadastrar", message);
      return;
    }

    Alert.alert("Associado cadastrado", `${fullName} já pode entrar com o e-mail e a senha informados.`);
    router.back();
  }

  return (
    <ScreenLayout title="Novo associado" back>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>Os dados abaixo serão usados para gerar as cobranças no Asaas.</Text>

          <TextInput style={styles.input} placeholder="Nome completo" value={fullName} onChangeText={setFullName} />
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="CPF/CNPJ (só números)"
            keyboardType="number-pad"
            value={cpfCnpj}
            onChangeText={setCpfCnpj}
          />
          <TextInput
            style={styles.input}
            placeholder="Telefone com DDD"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Senha temporária (mín. 6 caracteres)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cadastrar associado</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24 },
  subtitle: { fontSize: 13, color: theme.textMuted, marginBottom: 24 },
  input: {
    backgroundColor: theme.card,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
