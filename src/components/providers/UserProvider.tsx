"use client";
import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useUserStore } from "@/stores/useUserStore";

export default function ClientProvider() {
  const setSession = useUserStore((s) => s.setSession);
  const setProfile = useUserStore((s) => s.setProfile);
  const clear = useUserStore((s) => s.clear);
  const setLoading = useUserStore((s) => s.setLoading);
  const setError = useUserStore((s) => s.setError);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        clear();
      } else if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        try {
          console.log("in UserProvider try block");
          setLoading(true);
          setSession(session);
          const res = await fetch("/api/user-profile", { method: "POST" });
          const profile = await res.json();
          setProfile(profile);
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError("Unknown error");
          }
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setSession, setProfile, clear, setLoading, setError]);

  return null;
}

// How to use
//const { isLoading, error, profile } = useUserStore();
// if (isLoading) return <SkeletonUserProfile />;
// if (error) return <ErrorBanner message={error} />;
