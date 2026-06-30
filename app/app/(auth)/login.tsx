import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../src/lib/supabase";
import { cardShadow, theme } from "../../src/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Preencha email e senha");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert("Não foi possível entrar", error.message);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert("Digite seu email para recuperar a senha");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    Alert.alert(error ? "Erro" : "Verifique seu email", error?.message ?? "Enviamos um link de recuperação.");
  }

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons name="water" size={36} color="#fff" />
      </View>
      <Text style={styles.title}>Conta de Água</Text>
      <Text style={styles.subtitle}>Entre com sua conta da associação</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.link}>Esqueceu a senha?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: theme.bg },
  logo: {
    alignSelf: "center",
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    ...cardShadow,
  },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 4, color: theme.primaryDark },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 32, color: theme.textMuted },
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
  link: { color: theme.primary, textAlign: "center", marginTop: 16 },
});
