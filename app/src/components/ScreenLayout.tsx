import { useState, type ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SideMenu } from "./SideMenu";
import { theme } from "../theme";

interface Props {
  title: string;
  subtitle?: string;
  /** Mostra seta de voltar no lugar do menu (telas internas). */
  back?: boolean;
  /** Conteúdo opcional no canto direito do cabeçalho (ex.: botão +). */
  right?: ReactNode;
  children: ReactNode;
}

export function ScreenLayout({ title, subtitle, back, right, children }: Props) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[theme.primaryLight, theme.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 12 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => (back ? router.back() : setMenuOpen(true))}
            hitSlop={10}
          >
            <Ionicons name={back ? "chevron-back" : "menu"} size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerTexts}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          <View style={styles.rightSlot}>{right}</View>
        </View>
      </LinearGradient>

      {!back ? <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} /> : null}

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.bg },
  header: {
    paddingBottom: 18,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerRow: { flexDirection: "row", alignItems: "center" },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  headerTexts: { flex: 1, marginLeft: 12 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  subtitle: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 1 },
  rightSlot: { marginLeft: 8 },
  body: { flex: 1 },
});
