import { userProfiles } from '@/db/schema';

export type Role = 'USER' | 'BUSINESS' | 'ADMIN';
export type AuthStatus = 'init' | 'loading' | 'guest' | 'auth';
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
  'createdAt' | 'lastActivity'
> & {
  createdAt: string | null;
  lastActivity: string | null;
};

// // how to use
// useUserStore.getState().setProfile(serializeUserProfile(profile));
