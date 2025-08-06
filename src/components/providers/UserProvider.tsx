"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/useUserStore";

export default function ClientProvider() {
  const setSession = useUserStore((s) => s.setSession);
  const setProfile = useUserStore((s) => s.setProfile);
  const clear = useUserStore((s) => s.clear);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        clear();
      } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        setSession(session);
        const res = await fetch("/api/user-profile", { method: "POST" });
        const profile = await res.json();
        setProfile(profile);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setProfile, clear]);

  return null;
}
