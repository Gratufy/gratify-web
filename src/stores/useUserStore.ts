// import { create } from "zustand";
// import { createClient } from "@/utils/supabase/client";
// //import type { UserProfile } from "@/types/user";
import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { UserProfile } from '@/types';

interface UserState {
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  hasCheckedSession: boolean;
  error: string | null;
  setSession: (s: Session | null) => void;
  setProfile: (p: UserProfile | null) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string | null) => void;
  clear: () => void;
  setInitialized: () => void;
}
export const useUserStore = create<UserState>((set) => ({
  session: null,
  profile: null,
  isLoading: false,
  error: null,
  hasCheckedSession: false,
  setInitialized: () => set({ hasCheckedSession: true }),
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clear: () =>
    set({ session: null, profile: null, isLoading: false, error: null }),
}));

// IF HOOK hooks/useAuth.ts
export function useAuth() {
  const session = useUserStore((s) => s.session);
  const profile = useUserStore((s) => s.profile);
  const isLoadingAuth = useUserStore((s) => s.isLoading);
  const error = useUserStore((s) => s.error);
  const hasCheckedSession = useUserStore((s) => s.hasCheckedSession);
  const isLoggedIn = !!session && !isLoadingAuth;
  // const isGuest = !session && !isLoadingAuth;
  // const isAuth = !!session && !isLoadingAuth;
  const isAdmin = profile?.role === 'ADMIN';

  return {
    session,
    profile,
    isLoadingAuth,
    error,
    isLoggedIn,
    // isGuest,
    // isAuth,
    isAdmin,
    hasCheckedSession,
  };
}

//and in component
// const { isLoggedIn, isLoading, profile } = useAuth();

// return isAuthenticated ? <LogoutButton /> : <LoginLink />;
