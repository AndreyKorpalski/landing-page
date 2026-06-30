import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSessionContext } from "../../src/context/SessionProvider";

export default function AuthLayout() {
  const { session, role, loading } = useSessionContext();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (session && role === "admin") {
    return <Redirect href="/(admin)/dashboard" />;
  }
  if (session && role === "member") {
    return <Redirect href="/(member)/home" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
