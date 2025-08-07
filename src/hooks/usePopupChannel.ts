import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export const usePopupChannel = (
  popup: Window | null,
  clearPopup: () => void
) => {
  const router = useRouter();

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile || !popup) return;

    const channel = new BroadcastChannel("popup-channel");

    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const code = event.data?.authResultCode;
      if (!code) return;

      clearPopup();

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Failed to exchange code", error);
        return;
      }
      router.replace("/"); // Redirect after successful login
    };

    channel.addEventListener("message", listener);

    return () => {
      channel.removeEventListener("message", listener);
      channel.close();
    };
  }, [popup, clearPopup, router]);
};
