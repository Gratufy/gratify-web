import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export const useGoogleLogin = () => {
  const [popup, setPopup] = useState<Window | null>(null);

  const getRedirectUrl = () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      let base = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "";
      if (!base && process.env.NEXT_PUBLIC_VERCEL_URL?.trim()) {
        base = `https://${process.env.NEXT_PUBLIC_VERCEL_URL.trim()}`;
      }
      if (!base) {
        base = "http://localhost:3000";
      }
      if (!base.endsWith("/")) base += "/";
      return base + "auth/callback";
    } else {
      return window.location.origin + "/auth/popup-callback";
    }
  };

  const handleGoogleLogin = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const supabase = createClient();
    const redirectUrl = getRedirectUrl();
    // to prevent popup blocker on Desktop
    // FIRST - If not mobile, open a empty popup window before starting the OAuth flow
    let newPopup: Window | null = null;
    if (!isMobile) {
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      newPopup = window.open(
        "",
        "GoogleAuthPopup",
        `width=${width},height=${height},top=${top},left=${left}`
      );
      if (newPopup) setPopup(newPopup);
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: !isMobile,
        queryParams: { prompt: "select_account" },
      },
    });

    if (error || !data?.url) {
      console.error("OAuth login error", error);
      if (newPopup) newPopup.close();
      return;
    }

    if (isMobile) return; // if we are on mobile, we will redirect to the redirectUrl
    if (newPopup) newPopup.location.href = data.url; // open the OAuth URL in the popup
  };
  return { handleGoogleLogin, popup };
};
