import { ActivityIndicator, View } from "react-native";
import { Redirect, Stack } from "expo-router";
import { useSessionContext } from "../../src/context/SessionProvider";

export default function MemberLayout() {
  const { session, role, loading } = useSessionContext();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }
  if (role !== "member") {
    return <Redirect href="/(admin)/dashboard" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
