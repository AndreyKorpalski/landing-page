import { ScreenLayout } from "../../src/components/ScreenLayout";
import { AccountView } from "../../src/components/AccountView";

export default function AdminContaScreen() {
  return (
    <ScreenLayout title="Minha conta">
      <AccountView />
    </ScreenLayout>
  );
}
