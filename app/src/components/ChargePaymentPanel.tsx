import { useState } from "react";
import { Alert, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import type { Charge, PaymentMethod } from "../types/database.types";

export function ChargePaymentPanel({
  charge,
  preferredMethod,
}: {
  charge: Charge;
  preferredMethod: PaymentMethod | null;
}) {
  const [method, setMethod] = useState<PaymentMethod>(preferredMethod ?? "pix");

  async function copyPixCode() {
    if (!charge.pix_copy_paste) return;
    await Clipboard.setStringAsync(charge.pix_copy_paste);
    Alert.alert("Copiado", "Código Pix copiado para a área de transferência.");
  }

  function openBoleto() {
    if (charge.asaas_invoice_url) {
      Linking.openURL(charge.asaas_invoice_url);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, method === "pix" && styles.toggleButtonActive]}
          onPress={() => setMethod("pix")}
        >
          <Text style={[styles.toggleText, method === "pix" && styles.toggleTextActive]}>Pix</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, method === "boleto" && styles.toggleButtonActive]}
          onPress={() => setMethod("boleto")}
        >
          <Text style={[styles.toggleText, method === "boleto" && styles.toggleTextActive]}>Boleto</Text>
        </TouchableOpacity>
      </View>

      {method === "pix" ? (
        <View style={styles.panel}>
          {charge.pix_qr_code ? (
            <Image
              source={{ uri: `data:image/png;base64,${charge.pix_qr_code}` }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          ) : (
            <Text style={styles.muted}>QR Code Pix ainda não disponível para esta cobrança.</Text>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={copyPixCode} disabled={!charge.pix_copy_paste}>
            <Text style={styles.actionButtonText}>Copiar código Pix</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.panel}>
          <TouchableOpacity style={styles.actionButton} onPress={openBoleto} disabled={!charge.asaas_invoice_url}>
            <Text style={styles.actionButtonText}>Ver boleto</Text>
          </TouchableOpacity>
          {charge.boleto_barcode ? (
            <Text selectable style={styles.barcode}>
              {charge.boleto_barcode}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  toggleRow: { flexDirection: "row", backgroundColor: "#f1f5f9", borderRadius: 8, padding: 4 },
  toggleButton: { flex: 1, paddingVertical: 8, alignItems: "center", borderRadius: 6 },
  toggleButtonActive: { backgroundColor: "#0369a1" },
  toggleText: { fontWeight: "600", color: "#475569" },
  toggleTextActive: { color: "#fff" },
  panel: { marginTop: 16, alignItems: "center" },
  qrImage: { width: 220, height: 220, marginBottom: 12 },
  muted: { color: "#888", marginBottom: 12, textAlign: "center" },
  actionButton: {
    backgroundColor: "#0369a1",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  barcode: { marginTop: 12, fontSize: 12, color: "#444", textAlign: "center" },
});
