'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import IconGoogle from '@/assets/icons/general/icon-google.svg';
import { Spinner } from '@/components/ui/spinner';
// import { useGoogleLogin } from "@/hooks/useGoogleLogin";
// import { usePopupChannel } from "@/hooks/usePopupChannel";

const getRedirectUrl = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (isMobile) {
    let base = process.env.NEXT_PUBLIC_BASE_URL?.trim() || '';
    if (!base && process.env.NEXT_PUBLIC_VERCEL_URL?.trim()) {
      base = `https://${process.env.NEXT_PUBLIC_VERCEL_URL.trim()}`;
    }
    if (!base) {
      base = 'http://localhost:3000';
    }
    if (!base.endsWith('/')) base += '/';
    return base + 'auth/callback';
  } else {
    return window.location.origin + '/auth/popup-callback';
  }
};

//OAuth flow	in useGoogleLogin
//listen channel in 	usePopupChannel
//update session in 	usePopupChannel
const GoogleBtn = () => {
  const isExchangingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [popup, setPopup] = useState<Window | null>(null);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile || !popup) return;

    const channel = new BroadcastChannel('popup-channel');
    const listener = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      const code = event.data?.authResultCode;
      if (!code) return;
      /// new not to call exchangeCodeForSession multiple times
      if (isExchangingRef.current) return;
      isExchangingRef.current = true;
      ////
      setPopup(null);

      const supabase = createClient();
      // it is important to trigger the exchangeCodeForSession for userProvider
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setLoading(false);
        console.error('Failed to exchange code', error);
        return;
      }
      router.replace('/');
      // or any other route you want to redirect to after login
    };

    channel.addEventListener('message', listener);

    return () => {
      channel.removeEventListener('message', listener);
      channel.close();
    };
  }, [popup, router]);
  // const { handleGoogleLogin, popup } = useGoogleLogin();

  const handleGoogleLogin = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const supabase = createClient();
    if (!isMobile) setLoading(true);
    const redirectUrl = getRedirectUrl();

    // to prevent popup blocker on Desktop
    // FIRST - If not mobile, open a empty popup window before starting the OAuth flow
    let popup: Window | null = null;
    if (!isMobile) {
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      popup = window.open(
        '',
        'GoogleAuthPopup',
        `width=${width},height=${height},top=${top},left=${left}`
      );
      if (popup) setPopup(popup);
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: !isMobile,
        queryParams: {
          prompt: 'select_account',
        },
      },
    });

    if (error || !data?.url) {
      console.error('OAuth login error', error);
      if (popup) popup.close();

      return;
    }
    if (isMobile) return; // if we are on mobile, we will redirect to the redirectUrl
    if (popup) {
      popup.location.href = data.url; // open the OAuth URL in the popup
    }
  };
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <button
          className="btn-reject hover:no-underline focus:no-underline justify-start py-3"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <IconGoogle className="mr-3 size-4 xl:size-6" />

          <span className="xl:placeholder-base lg:placeholder-sm placeholder-xs">
            Продовжити з Google
          </span>
        </button>
      )}
    </>
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
