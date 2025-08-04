"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function PopupCallback() {
  const params = useSearchParams();
  const code = params.get("code");

  useEffect(() => {
    if (!code) {
      window.close();
      return;
    }

    const channel = new BroadcastChannel("popup-channel");
    channel.postMessage({ authResultCode: code });
    channel.close();

    window.close();
  }, [code]);

  return null;
}
