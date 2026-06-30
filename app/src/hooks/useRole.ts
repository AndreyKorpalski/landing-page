import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Profile, UserRole } from "../types/database.types";

export function useRole(userId: string | undefined) {
  const [role, setRole] = useState<UserRole | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRole(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          setRole(null);
          setProfile(null);
        } else {
          setProfile(data as Profile);
          setRole((data as Profile).role);
        }
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId]);

  return { role, profile, loading };
}
