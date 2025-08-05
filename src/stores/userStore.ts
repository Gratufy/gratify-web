// import { create } from "zustand";
// import { createClient } from "@/utils/supabase/client";
// //import type { UserProfile } from "@/types/user";

// export type UserProfile = {
//   user_id: string;
//   email: string;
//   role: "USER" | "BUSINESS" | "ADMIN";
//   status: "active" | "blocked";
//   created_at: string;
//   last_activity: string;
// };
// interface UserState {
//   authUser: { id: string; email: string } | null;
//   profile: UserProfile | null;
//   loading: boolean;
//   error: string | null;
//   fetchUser: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// export const useUserStore = create<UserState>((set) => ({
//   authUser: null,
//   profile: null,
//   loading: true,
//   error: null,

//   fetchUser: async () => {
//     set({ loading: true });
//     const supabase = createClient();

//     const {
//       data: { user },
//       error,
//     } = await supabase.auth.getUser();

//     if (!user || error) {
//       set({ authUser: null, profile: null, loading: false });
//       return;
//     }

//     try {
//       // API on server creates or updates user profile Drizzle ORM
//       const res = await fetch("/api/sync-user");
//       if (!res.ok) throw new Error("Failed to fetch profile");
//       const profile: UserProfile = await res.json();

//       set({
//         authUser: { id: user.id, email: user.email! },
//         profile,
//         loading: false,
//         error: null,
//       });
//     } catch (e) {
//       const errorMessage =
//         e instanceof Error ? e.message : "An unknown error occurred";
//       set({ error: errorMessage, loading: false });
//     }
//   },

//   logout: async () => {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     set({ authUser: null, profile: null });
//     window.location.href = "/";
//   },
// }));
