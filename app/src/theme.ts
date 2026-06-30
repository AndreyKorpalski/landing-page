// Tokens de design compartilhados — manter as cores/raios/sombra num lugar só
// para o app ter um visual consistente.

export const theme = {
  primary: "#0369a1",
  primaryDark: "#075985",
  primaryLight: "#0ea5e9",
  accent: "#7c3aed",
  bg: "#f1f5f9",
  card: "#ffffff",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  danger: "#dc2626",
  success: "#16a34a",
  warning: "#d97706",
};

// Sombra leve reutilizável (iOS + Android).
export const cardShadow = {
  shadowColor: "#0f172a",
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
} as const;
