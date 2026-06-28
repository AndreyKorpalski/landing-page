import { StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import type { MonthlyCollected } from "../../types/database.types";

export function CollectedTrendLine({ data }: { data: MonthlyCollected[] }) {
  const chartData = data.map((item) => ({
    value: item.total,
    label: new Date(item.month).toLocaleDateString("pt-BR", { month: "short" }),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Total arrecadado por mês</Text>
      {chartData.length > 0 ? (
        <LineChart
          data={chartData}
          height={160}
          color="#0369a1"
          thickness={2}
          yAxisTextStyle={{ fontSize: 10 }}
          xAxisLabelTextStyle={{ fontSize: 10 }}
          noOfSections={4}
          curved
        />
      ) : (
        <Text style={styles.muted}>Ainda não há pagamentos registrados.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", borderRadius: 10, padding: 16, marginTop: 12 },
  title: { fontSize: 14, fontWeight: "600", color: "#0f172a", marginBottom: 12 },
  muted: { color: "#888" },
});
