import { userProfiles } from "@/db/schema";

export type Role = "USER" | "BUSINESS" | "ADMIN";
// export type UserProfile = {
//   userId: string;
//   email: string;
//   role: Role;
//   status: string;
//   createdAt: string;
//   lastActivity: string;
// };
export type UserProfile = typeof userProfiles.$inferSelect;
export type UserProfileUpdate = Partial<UserProfile>;
export type NewUserProfile = typeof userProfiles.$inferInsert;

export type UserProfileSerialized = Omit<
  UserProfile,
  "createdAt" | "lastActivity"
> & {
  createdAt: string | null;
  lastActivity: string | null;
};

// for zustand
//import type { UserProfileSerialized } from "@/types";
// interface UserState {
//   session: Session | null;
//   profile: UserProfileSerialized | null;
//   isLoading: boolean;
//   error: string | null;
//   setSession: (s: Session | null) => void;
//   setProfile: (p: UserProfileSerialized | null) => void;
//   setLoading: (v: boolean) => void;
//   setError: (e: string | null) => void;
//   clear: () => void;
// }

// function serializeUserProfile(profile: UserProfile): UserProfileSerialized {
//   return {
//     ...profile,
//     createdAt: profile.createdAt?.toISOString() ?? null,
//     lastActivity: profile.lastActivity?.toISOString() ?? null,
//   };
// }

// // how to use
// useUserStore.getState().setProfile(serializeUserProfile(profile));
