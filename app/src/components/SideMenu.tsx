import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSessionContext } from "../context/SessionProvider";
import { supabase } from "../lib/supabase";
import { theme } from "../theme";

const PANEL_W = Math.min(300, Dimensions.get("window").width * 0.82);

type Item = { label: string; icon: keyof typeof Ionicons.glyphMap; href: string; match: string };

const MEMBER_ITEMS: Item[] = [
  { label: "Início", icon: "home-outline", href: "/(member)/home", match: "/home" },
  { label: "Histórico", icon: "time-outline", href: "/(member)/historico", match: "/historico" },
  { label: "Minha conta", icon: "person-outline", href: "/(member)/conta", match: "/conta" },
];

const ADMIN_ITEMS: Item[] = [
  { label: "Dashboard", icon: "stats-chart-outline", href: "/(admin)/dashboard", match: "/dashboard" },
  { label: "Associados", icon: "people-outline", href: "/(admin)/members", match: "/members" },
  { label: "Minha conta", icon: "person-outline", href: "/(admin)/conta", match: "/conta" },
];

export function SideMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { profile, role, session } = useSessionContext();
  const items = role === "admin" ? ADMIN_ITEMS : MEMBER_ITEMS;

  const translateX = useRef(new Animated.Value(-PANEL_W)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const [rendered, setRendered] = useState(open);

  useEffect(() => {
    if (open) {
      setRendered(true);
      Animated.parallel([
        Animated.timing(translateX, { toValue: 0, duration: 220, useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else if (rendered) {
      Animated.parallel([
        Animated.timing(translateX, { toValue: -PANEL_W, duration: 200, useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(({ finished }) => {
        if (finished) setRendered(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!rendered) return null;

  function go(href: string) {
    onClose();
    router.push(href as never);
  }

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={onClose}>
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[styles.panel, { width: PANEL_W, paddingTop: insets.top + 24, transform: [{ translateX }] }]}
      >
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Ionicons name="water" size={22} color="#fff" />
          </View>
          <Text style={styles.brand}>Conta de Água</Text>
        </View>

        <View style={styles.userBox}>
          <Text style={styles.userName} numberOfLines={1}>
            {profile?.full_name ?? "Usuário"}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {session?.user.email}
          </Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{role === "admin" ? "Administrador" : "Associado"}</Text>
          </View>
        </View>

        <View style={styles.nav}>
          {items.map((item) => {
            const active = pathname === item.match;
            return (
              <Pressable
                key={item.href}
                onPress={() => go(item.href)}
                style={[styles.navItem, active && styles.navItemActive]}
              >
                <Ionicons name={item.icon} size={20} color={active ? theme.primary : theme.textMuted} />
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        <Pressable
          onPress={() => {
            onClose();
            supabase.auth.signOut();
          }}
          style={[styles.navItem, { marginBottom: insets.bottom + 12 }]}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.danger} />
          <Text style={[styles.navLabel, { color: theme.danger }]}>Sair</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(15,23,42,0.45)" },
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontSize: 17, fontWeight: "700", color: theme.text },
  userBox: {
    backgroundColor: theme.bg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
  },
  userName: { fontSize: 15, fontWeight: "700", color: theme.text },
  userEmail: { fontSize: 12, color: theme.textMuted, marginTop: 2 },
  roleBadge: {
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  roleText: { fontSize: 11, fontWeight: "700", color: theme.primaryDark },
  nav: { gap: 4 },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  navItemActive: { backgroundColor: "#e0f2fe" },
  navLabel: { fontSize: 15, fontWeight: "600", color: theme.textMuted },
  navLabelActive: { color: theme.primary },
});
