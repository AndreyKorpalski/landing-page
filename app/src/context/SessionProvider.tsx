import { createContext, useContext, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useSession } from "../hooks/useSession";
import { useRole } from "../hooks/useRole";
import type { Profile, UserRole } from "../types/database.types";

interface SessionContextValue {
  session: Session | null;
  role: UserRole | null;
  profile: Profile | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  role: null,
  profile: null,
  loading: true,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const { session, loading: sessionLoading } = useSession();
  const { role, profile, loading: roleLoading } = useRole(session?.user.id);

  const loading = sessionLoading || (!!session && roleLoading);

  return (
    <SessionContext.Provider value={{ session, role, profile, loading }}>{children}</SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
