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
