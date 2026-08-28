import { createClient } from "@/lib/supabase/client";
import { useState, useMemo, useCallback } from "react";

export function useAdminAuthAction() {
  const [loading, setLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  const signIn = useCallback(
    async ({ email, password }: { email: string; password: string }) => {
      setLoading(true);
      try {
        const res = await supabase.auth.signInWithPassword({ email, password });
        return res;
      } finally {
        setLoading(false);
      }
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const res = await supabase.auth.signOut();
      return res;
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  return {
    signIn,
    signOut,
    loading,
  };
}
