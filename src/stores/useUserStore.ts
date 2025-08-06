// import { create } from "zustand";
// import { createClient } from "@/utils/supabase/client";
// //import type { UserProfile } from "@/types/user";
import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";

type Role = "USER" | "BUSINESS" | "ADMIN";

interface UserProfile {
  userId: string;
  email: string;
  role: Role;
  status: string;
  createdAt: string;
  lastActivity: string;
}

interface UserState {
  session: Session | null;
  profile: UserProfile | null;
  setSession: (s: Session | null) => void;
  setProfile: (p: UserProfile | null) => void;
  clear: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  session: null,
  profile: null,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  clear: () => set({ session: null, profile: null }),
}));
