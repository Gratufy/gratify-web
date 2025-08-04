"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const GoogleBtn = () => {
  const router = useRouter();
  const [popup, setPopup] = useState<Window | null>(null);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile || !popup) return;
    console.log("Mobile:", isMobile);
    const channel = new BroadcastChannel("popup-channel");
    const listener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.authResultCode) {
        setPopup(null);

        // window.location.href = `/auth/callback?code=${event.data.authResultCode}`;
        router.push(`/auth/callback?code=${event.data.authResultCode}`);
      }
    };

    channel.addEventListener("message", listener);

    return () => {
      channel.removeEventListener("message", listener);
      channel.close();
    };
  }, [popup, router]);

  const handleGoogleLogin = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const supabase = createClient();
    const redirectUrl = isMobile
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`
      : `${window.location.origin}/auth/popup-callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: !isMobile,
      },
    });

    if (error || !data?.url) {
      console.error("OAuth login error", error);
      return;
    }
    if (isMobile) return;
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const newPopup = window.open(
      data.url,
      "GoogleAuthPopup",
      `width=${width},height=${height},top=${top},left=${left}`
    );
    if (newPopup) setPopup(newPopup);

    //
    //-----------------------------
    // if (isMobile) {
    //   await supabase.auth.signInWithOAuth({
    //     provider: "google",
    //     options: {
    //       redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    //       // skipBrowserRedirect: true, // Adjust this to your callback URL
    //       //redirectTo: "http://localhost:3000/auth/callback",
    //       /*  queryParams: {
    //       access_type: "offline", // to get refresh_token
    //       prompt: "consent", // to ensure the user is prompted for consent
    //     }, */
    //     },
    //   });
    //   return;
    // }
    // Десктоп — открываем попап
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: "google",
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/popup-callback`,
    //     skipBrowserRedirect: true,
    //   },
    // });

    // if (error || !data?.url) {
    //   console.error("OAuth login error", error);
    //   return;
    // }
  };
  return (
    <button
      className="flex items-center cursor-pointer gap-3 py-2 rounded-sm h-10 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-sm font-medium text-gray-800 dark:text-gray-200 shadow hover:shadow-md transition"
      onClick={handleGoogleLogin}
    >
      <div className="w-6 h-6">
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{ display: "block" }}
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          ></path>
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          ></path>
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          ></path>
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          ></path>
          <path fill="none" d="M0 0h48v48H0z"></path>
        </svg>
      </div>

      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleBtn;

// const handleGoogleLogin = async () => {
//   const { error } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: {
//       redirectTo: `${window.location.origin}/auth/callback`, // или свой URL
//     },
//   });
//   if (error) console.error(error.message);
// };
